import fetchData from "@/lib/fetchData";
import { CreateFriendInviteSchemaType, UpdateFriendInviteSchemaType } from "../../../types/clientSchemas";
import { FriendInviteServiceResponse, GetOutgoingFriendInviteServiceResponse } from "./types/response/friendInvites";

class FriendInviteService {
  static baseUrl ='/api/friendInvites';

  static post(data: CreateFriendInviteSchemaType): Promise<FriendInviteServiceResponse> {
    return fetchData<FriendInviteServiceResponse>(`${this.baseUrl}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data)
    })
  }

  static getOutgoing(data: { id: string }): Promise<GetOutgoingFriendInviteServiceResponse> {
    return fetchData<GetOutgoingFriendInviteServiceResponse>(`${this.baseUrl}/outgoing/${data.id}`, {
      method: "GET",
      credentials: "include",
    })
  }

  // static getIncoming(data: { id: string }): Promise<GetIncomingFriendInvites> {
  //   return fetchData<GetIncomingFriendInvites>(`${this.baseUrl}/`)
  // } 

  static acceptFriendInvite(data: UpdateFriendInviteSchemaType): Promise<FriendInviteServiceResponse> {
    return fetchData<FriendInviteServiceResponse>(`${this.baseUrl}/accept`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    })
  }

  static declineFriendInvite(data: UpdateFriendInviteSchemaType): Promise<FriendInviteServiceResponse> {
    return fetchData<FriendInviteServiceResponse>(`${this.baseUrl}/decline`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    })
  }

}

export default FriendInviteService;