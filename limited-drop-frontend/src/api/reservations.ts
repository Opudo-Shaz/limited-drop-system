import { api } from "./index";

export interface Reservation {
  id: string;
  expiresAt: string;
  status: string;
}

export const reserveProduct = async (userId: string, productId: string, quantity = 1) => {
  const res = await api.post("/reserve", { userId, productId, quantity });
  return res.data.data as Reservation;
};