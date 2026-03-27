import { api } from "./index";

export interface User {
  id: string;
  email: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

const buildGuestEmail = () => {
  const random = Math.random().toString(36).slice(2, 8);
  return `guest-${Date.now()}-${random}@limiteddrop.local`;
};

export const createGuestUser = async (): Promise<User> => {
  const res = await api.post<ApiEnvelope<User>>("/users", {
    email: buildGuestEmail()
  });

  return res.data.data;
};
