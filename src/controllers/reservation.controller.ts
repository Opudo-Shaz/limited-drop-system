import { Request, Response } from "express";
import { reserveSchema } from "../validators/reservation.validator";
import { reserveService } from "../services/reservation.service";

export const reserveProduct = async (req: Request, res: Response) => {
  try {
    const data = reserveSchema.parse(req.body);

    const reservation = await reserveService(data);

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};