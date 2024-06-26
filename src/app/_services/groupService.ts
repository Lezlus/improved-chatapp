import fetchData from "@/lib/fetchData";
import { CreateGroupSchemaType } from "../../../types/clientSchemas/groups";
import { GroupServiceResponse } from "./types/response/groups";

class GroupService {
  static baseUrl = '/api/groups'

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