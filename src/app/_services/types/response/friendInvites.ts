import { BaseResponse } from "./base";
import { UserUnpopulatedType, FriendInviteSchemaType, OutGoingFriendInviteSchemaType } from "../../../../../types/clientSchemas";


export interface FriendInviteServiceResponse extends BaseResponse {
  friends?: UserUnpopulatedType[];
  friendInvites?: FriendInviteSchemaType[];
}

export interface GetOutgoingFriendInviteServiceResponse extends BaseResponse {
  outGoingFriendInvites: OutGoingFriendInviteSchemaType[]
}

