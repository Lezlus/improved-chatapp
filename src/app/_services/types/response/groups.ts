import { BaseResponse } from "./base";
import { GroupSchemaType } from "../../../../../types/clientSchemas";
import { GroupMessageSchemaType } from "../../../../../types/clientSchemas";

export interface GroupServiceResponse extends BaseResponse {
  group: GroupSchemaType;
}

export interface GroupServiceGetMessagesResponse extends BaseResponse {
  messages: GroupMessageSchemaType[];
}