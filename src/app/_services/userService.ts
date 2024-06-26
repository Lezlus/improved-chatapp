import fetchData from "@/lib/fetchData";
import { UserServiceResponse } from "./types/response/users";

class UserService {
  static baseUrl = '/api/users';

  static get(data: { name: string }): Promise<UserServiceResponse> {
    return fetchData<UserServiceResponse>(`${this.baseUrl}/${data.name}`, {
      method: "GET",
      credentials: "include",
    })
  }
}

export default UserService;