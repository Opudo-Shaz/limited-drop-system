import { api } from "./index";

export interface Reservation {
  id: string;
  expiresAt: string;
  status: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const reserveProduct = async (userId: string, productId: string): Promise<Reservation> => {
  const res = await api.post<ApiEnvelope<Reservation>>(`/reserve`, {
    userId,
    productId,
    quantity: 1
  });
  return res.data.data;
};