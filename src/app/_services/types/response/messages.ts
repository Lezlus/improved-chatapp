import { BaseResponse } from "./base";
import { DirectMessageSchemaType } from "../../../../../types/clientSchemas";

export interface GetMessageServiceResponse extends BaseResponse {
  messages: DirectMessageSchemaType[];
}

export interface CreateMessageServiceResponse extends BaseResponse {
  message: DirectMessageSchemaType;
}