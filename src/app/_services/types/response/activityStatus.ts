import { BaseResponse } from "./base";
import { UserUnpopulatedType } from "../../../../../types/clientSchemas";

export interface ActivityStatusResponse extends BaseResponse {
  user: UserUnpopulatedType
}