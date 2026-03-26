import { api } from "./index";

export interface Product {
  id: string;
  name: string;
  stock: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get<ApiEnvelope<Product[]>>("/products");
  return res.data.data;
};