import { apiRequest } from "./queryClient";
import type { User, LoginUser, InsertUser } from "@shared/schema";

export interface AuthResponse {
  user: Omit<User, 'password'>;
}

export const authApi = {
  login: async (credentials: LoginUser): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    return await response.json();
  },

  register: async (userData: InsertUser): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    return await response.json();
  },
};

export const getCurrentUser = (): Omit<User, 'password'> | null => {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: Omit<User, 'password'>) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem("user");
};
