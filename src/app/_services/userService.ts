import fetchData from "@/lib/fetchData";
import { UserUnpopulatedType } from "../../../types/userUnpopulated";

interface UserServiceResponse {
  success: boolean;
  user: UserUnpopulatedType
}

class UserService {
  static baseUrl =  process.env.NEXT_PUBLIC_URL + '/api/users';

  static get(data: { name: string }): Promise<UserServiceResponse> {
    return fetchData<UserServiceResponse>(`${this.baseUrl}/${data.name}`, {
      method: "GET",
      credentials: "include",
    })
  }
}

export default UserService;