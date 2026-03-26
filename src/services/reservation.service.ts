import { prisma } from "../lib/prisma";

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

    // 1. Prevent duplicate active reservation
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

    // 2. Check product stock
    const product = await tx.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.stock < quantity) {
      throw new Error("Not enough stock");
    }

    // 3. Deduct stock safely
    await tx.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity
        }
      }
    });

    // 4. Create reservation
    const reservation = await tx.reservation.create({
      data: {
        userId,
        productId,
        quantity,
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
      }
    });

    // 5. Log inventory change
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