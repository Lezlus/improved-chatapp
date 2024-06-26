import { UserType } from "../../../../../types/clientSchemas";
export interface AuthResponse {
  isAuthenticated: boolean;
  user: UserType | null;
}

export interface RegisterAuthResponse {
  message: { userTaken: boolean, msgError: boolean };
}