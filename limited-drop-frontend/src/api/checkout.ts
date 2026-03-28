import { api } from "./index";

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const checkoutReservation = async (reservationId: string): Promise<Order> => {
  const res = await api.post<ApiEnvelope<Order>>("/checkout", {
    reservationId
  });

  return res.data.data;
};
