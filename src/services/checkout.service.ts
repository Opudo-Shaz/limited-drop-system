import { prisma } from "../lib/prisma";

export const checkoutService = async (reservationId: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Find the reservation
    const reservation = await tx.reservation.findUnique({
      where: { id: reservationId }
    });

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (reservation.status !== "ACTIVE") {
      throw new Error("Reservation is not active or has expired");
    }

    if (reservation.expiresAt < new Date()) {
      // Optional: auto-rollback stock if expired
      await tx.product.update({
        where: { id: reservation.productId },
        data: { stock: { increment: reservation.quantity } }
      });

      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: "EXPIRED" }
      });

      throw new Error("Reservation has expired");
    }

    // 2. Create order
    const order = await tx.order.create({
      data: {
        userId: reservation.userId,
        productId: reservation.productId,
        quantity: reservation.quantity
      }
    });

    // 3. Mark reservation as completed
    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: "COMPLETED" }
    });

    // 4. Log inventory (optional for audit)
    await tx.inventoryLog.create({
      data: {
        productId: reservation.productId,
        change: 0, // no change in stock here, already deducted at reservation
        reason: "CHECKOUT"
      }
    });

    return order;
  });
};