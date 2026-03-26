import { prisma } from "../lib/prisma";

export const RESERVATION_TTL_MS = 5 * 60 * 1000;

export const getReservationExpiryDate = (from: Date = new Date()) =>
  new Date(from.getTime() + RESERVATION_TTL_MS);

export const expireReservations = async () => {
  const now = new Date();

  // Find all ACTIVE reservations that have expired
  const expiredReservations = await prisma.reservation.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lte: now }
    }
  });

  if (expiredReservations.length === 0) return 0;

  await prisma.$transaction(async (tx) => {
    for (const res of expiredReservations) {
      // Restore stock
      await tx.product.update({
        where: { id: res.productId },
        data: { stock: { increment: res.quantity } }
      });

      // Mark reservation as EXPIRED
      await tx.reservation.update({
        where: { id: res.id },
        data: { status: "EXPIRED" }
      });

      // Log inventory
      await tx.inventoryLog.create({
        data: {
          productId: res.productId,
          change: res.quantity,
          reason: "RESERVATION_EXPIRED"
        }
      });
    }
  });

  console.log(`Expired ${expiredReservations.length} reservations at ${now.toISOString()}`);
  return expiredReservations.length;
};