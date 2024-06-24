import { AuthResponse, RegisterAuthResponse } from "./authTypes";
import fetchData from "@/lib/fetchData";
import { GroupSchemaType, CreateGroupSchemaType } from "../../../types/groups";

interface GroupServiceResponse {
  success: boolean;
  group: GroupSchemaType
}

class GroupService {
  static baseUrl =  process.env.URL + '/api/groups'

  static get(data: { name: string }): Promise<GroupServiceResponse> {
    return fetchData<GroupServiceResponse>(`${this.baseUrl}`, {
      method: "GET",
      credentials: "include",
      body: JSON.stringify(data)
    })
  }

  static create(data: CreateGroupSchemaType): Promise<GroupServiceResponse> {
    return fetchData<GroupServiceResponse>(`${this.baseUrl}`, {
      method: "POST",
      credentials:"include",
      body: JSON.stringify(data)
    })
  }
}

export default GroupService;