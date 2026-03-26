import { api } from "./index";

export interface Product {
  id: string;
  name: string;
  stock: number;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  return res.data.data;
};