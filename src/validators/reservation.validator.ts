import { z } from "zod";

export const reserveSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive()
});