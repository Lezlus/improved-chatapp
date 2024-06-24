import fetchData from "@/lib/fetchData";
import { CreateFriendInviteSchemaType, OutGoingFriendInviteSchemaType, UpdateFriendInviteSchemaType } from "../../../types/friendInvites";
import { UserUnpopulatedType } from "../../../types/userUnpopulated";
import { FriendInviteSchemaType } from "../../../types/friendInvites";

interface FriendInviteServiceResponse {
  success: boolean;
  err?: Error;
  friends?: UserUnpopulatedType[];
  friendInvites?: FriendInviteSchemaType[];
}

interface GetFriendInviteServiceResponse {
  success: boolean;
  outGoingFriendInvites: OutGoingFriendInviteSchemaType[]
}



class FriendInviteService {
  static baseUrl =  process.env.NEXT_PUBLIC_URL + '/api/friendInvites';

  static post(data: CreateFriendInviteSchemaType): Promise<FriendInviteServiceResponse> {
    return fetchData<FriendInviteServiceResponse>(`${this.baseUrl}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data)
    })
  }

  static getOutgoing(data: { id: string }): Promise<GetFriendInviteServiceResponse> {
    return fetchData<GetFriendInviteServiceResponse>(`${this.baseUrl}/outgoing/${data.id}`, {
      method: "GET",
      credentials: "include",
    })
  }

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