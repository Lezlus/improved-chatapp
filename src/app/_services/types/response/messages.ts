import { BaseResponse } from "./base";
import { PopulatedMessageSchemaType } from "../../../../../types/clientSchemas";

export interface GetMessageServiceResponse extends BaseResponse {
  messages: PopulatedMessageSchemaType[];
}

export interface CreateMessageServiceResponse extends BaseResponse {
  message: PopulatedMessageSchemaType;
}