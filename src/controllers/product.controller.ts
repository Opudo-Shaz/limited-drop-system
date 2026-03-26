import { Request, Response } from "express";
import { z } from "zod";
import {
  createProductService,
  listProductsService
} from "../services/product.service";

const createProductSchema = z.object({
  name: z.string().min(1),
  stock: z.number().int().nonnegative()
});

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await createProductService(data);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await listProductsService();

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
