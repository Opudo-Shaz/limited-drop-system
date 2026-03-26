import { Request, Response } from "express";
import { reserveSchema } from "../validators/reservation.validator";
import { createReservation } from "../services/reservation.service";

export const reserveProduct = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = reserveSchema.parse(req.body);

    const reservation = await createReservation(userId, productId, quantity);

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};