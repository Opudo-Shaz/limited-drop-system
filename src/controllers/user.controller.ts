import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email()
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = userSchema.parse(req.body);

    const user = await prisma.user.create({
      data
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};