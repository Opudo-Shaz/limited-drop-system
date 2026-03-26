import { prisma } from "../lib/prisma";

export const createReservation = async (userId: string, productId: string, quantity: number) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Check if user already has an ACTIVE reservation for this product
    const existing = await tx.reservation.findFirst({
      where: {
        userId,
        productId,
        status: "ACTIVE",
      }
    });

    if (existing) {
      throw new Error("You already have an active reservation for this product");
    }

    // 2. Check product stock
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");
    if (product.stock < quantity) throw new Error("Insufficient stock");

    // 3. Deduct stock and create reservation
    const reservation = await tx.reservation.create({
      data: {
        userId,
        productId,
        quantity,
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      }
    });

    await tx.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } }
    });

    // 4. Log inventory
    await tx.inventoryLog.create({
      data: {
        productId,
        change: -quantity,
        reason: "RESERVATION"
      }
    });

    return reservation;
  });
};