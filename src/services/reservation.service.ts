import { prisma } from "../lib/prisma";
import { getReservationExpiryDate } from "./expiration.service";

interface ReserveInput {
  userId: string;
  productId: string;
  quantity: number;
}

export const reserveService = async ({
  userId,
  productId,
  quantity
}: ReserveInput) => {
  return await prisma.$transaction(async (tx) => {

    // Prevent duplicate active reservation
    const existing = await tx.reservation.findFirst({
      where: {
        userId,
        productId,
        status: "ACTIVE"
      }
    });

    if (existing) {
      throw new Error("You already have an active reservation");
    }

    // Check product stock
    const product = await tx.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.stock < quantity) {
      throw new Error("Not enough stock");
    }

    // Deduct stock safely
    await tx.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity
        }
      }
    });

    // Create reservation
    const reservation = await tx.reservation.create({
      data: {
        userId,
        productId,
        quantity,
        status: "ACTIVE",
        expiresAt: getReservationExpiryDate()
      }
    });

    // Log inventory change
    await tx.inventoryLog.create({
      data: {
        productId,
        change: -quantity,
        reason: "RESERVE"
      }
    });

    return reservation;
  });
};