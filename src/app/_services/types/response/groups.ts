import { BaseResponse } from "./base";
import { GroupSchemaType } from "../../../../../types/clientSchemas";

export interface GroupServiceResponse extends BaseResponse {
  group: GroupSchemaType;
}