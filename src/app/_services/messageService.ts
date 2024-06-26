import fetchData from "@/lib/fetchData";
import { MessageSchemaType } from "../../../types/clientSchemas";
import { CreateMessageSchemaType } from "../../../types/clientSchemas/messages";
import { GetMessageServiceResponse, CreateMessageServiceResponse } from "./types/response/messages";

class MessageService {
  static baseUrl ="/api/messages";

  static getMessagesBetweenUsers(data: { currentUser: string, nextUser: string }) {
    return fetchData<GetMessageServiceResponse>(`${this.baseUrl}/messagesBetweenUsers/${data.currentUser}-${data.nextUser}`, {
      method: "GET",
      credentials: "include",
    })
  }

  static create(data: CreateMessageSchemaType) {
    return fetchData<CreateMessageServiceResponse>(`${this.baseUrl}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    })
  }
}

export default MessageService;