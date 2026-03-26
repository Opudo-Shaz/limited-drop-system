import { prisma } from "../lib/prisma";

interface CreateProductInput {
  name: string;
  stock: number;
}

export const createProductService = async ({
  name,
  stock
}: CreateProductInput) => {
  const product = await prisma.product.create({
    data: {
      name,
      stock
    }
  });

  return product;
};

export const listProductsService = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return products;
};
