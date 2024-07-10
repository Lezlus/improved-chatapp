import { BaseResponse } from "./base";
import { GroupSchemaType, GroupChatInviteSchemaType } from "../../../../../types/clientSchemas";

export interface GroupChatInviteResponse extends BaseResponse {
  groupChatInvite: GroupChatInviteSchemaType
}

export interface GroupChatInviteAcceptResponse extends BaseResponse {
  group: GroupSchemaType;
}

export interface GroupChatInviteDeclineResponse extends BaseResponse {

}