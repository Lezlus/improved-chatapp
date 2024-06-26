import { BaseResponse } from "./base";
import { UserUnpopulatedType } from "../../../../../types/clientSchemas";

export interface UserServiceResponse extends BaseResponse {
  user: UserUnpopulatedType;
}