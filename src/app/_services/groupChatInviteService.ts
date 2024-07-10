import fetchData from "@/lib/fetchData";
import { GroupChatInviteResponse, GroupChatInviteAcceptResponse, GroupChatInviteDeclineResponse } from './types/response/groupChatInvites'
import { CreateGroupChatInviteSchemaType, GroupChatInviteSchemaType } from "../../../types/clientSchemas";

class GroupChatInviteService {
  static baseUrl = "/api/groupChatInvites";
  
  static create(data: CreateGroupChatInviteSchemaType): Promise<GroupChatInviteResponse> {
    return fetchData<GroupChatInviteResponse>(`${this.baseUrl}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    })
  }

  static accept(data: GroupChatInviteSchemaType): Promise<GroupChatInviteAcceptResponse> {
    return fetchData<GroupChatInviteAcceptResponse>(`${this.baseUrl}/accept`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data)
    })
  }

  static decline(data: GroupChatInviteSchemaType): Promise<GroupChatInviteDeclineResponse> {
    return fetchData<GroupChatInviteDeclineResponse>(`${this.baseUrl}/decline`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    })
  }
}

export default GroupChatInviteService