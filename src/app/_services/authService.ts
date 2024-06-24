import { AuthResponse, RegisterAuthResponse } from "./authTypes";
import fetchData from "@/lib/fetchData";
import { UserRegisterAndLoginType } from "../../../types/users";

class AuthService {
  static baseUrl = process.env.NEXT_PUBLIC_URL + '/api/users'

  static login(user: UserRegisterAndLoginType): Promise<AuthResponse> {
    return fetchData<AuthResponse>(`${this.baseUrl}/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(user)
    })
  }

  static register(user: UserRegisterAndLoginType): Promise<RegisterAuthResponse> {
    return fetchData<RegisterAuthResponse>(`${this.baseUrl}/signup`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(user)
    })
  }

  static logout(): Promise<AuthResponse> {
    return fetchData<AuthResponse>(`${this.baseUrl}/logout`, {
      method: "GET",
      credentials: 'include'
    })
  }
}

export default AuthService