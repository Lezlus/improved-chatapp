import { UserType } from "../../../../types/users";

export interface AuthResponse {
  isAuthenticated: boolean;
  user: UserType | null;
}

export interface RegisterAuthResponse {
  message: { userTaken: boolean, msgError: boolean };
}