import { Request, Response } from "express";
import { z } from "zod";
import { checkoutService } from "../services/checkout.service";

const checkoutSchema = z.object({
  reservationId: z.string().uuid()
});

export const checkoutReservation = async (req: Request, res: Response) => {
  try {
    const { reservationId } = checkoutSchema.parse(req.body);

    const order = await checkoutService(reservationId);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};