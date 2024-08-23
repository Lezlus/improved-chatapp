import { AuthResponse, RegisterAuthResponse } from "./types/response/auth";
import { BaseResponse } from "./types/response/base";
import fetchData from "@/lib/fetchData";
import { UserRegisterAndLoginType } from "../../../types/clientSchemas";

class AuthService {
  static baseUrl = '/api/users'

  static login(user: UserRegisterAndLoginType): Promise<AuthResponse> {
    return fetchData<AuthResponse>(`${this.baseUrl}/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(user),
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

  // static pingPusher(): Promise<BaseResponse> {
  //   return fetchData<BaseResponse>(`/api/pusher/auth`, {
  //     method: "GET",
  //   })
  // }
}

export default AuthService