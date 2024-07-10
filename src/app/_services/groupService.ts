import fetchData from "@/lib/fetchData";
import { CreateGroupSchemaType } from "../../../types/clientSchemas/groups";
import { GroupServiceResponse, GroupServiceGetMessagesResponse } from "./types/response/groups";

class GroupService {
  static baseUrl = '/api/groups'

  static get(data: { name: string }): Promise<GroupServiceResponse> {
    return fetchData<GroupServiceResponse>(`${this.baseUrl}/${data.name}`, {
      method: "GET",
      credentials: "include",
    })
  }

  static getMessages(data: { id: string }): Promise<GroupServiceGetMessagesResponse> {
    return fetchData<GroupServiceGetMessagesResponse>(`${this.baseUrl}/messages/${data.id}`, {
      method: "GET",
      credentials: "include"
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