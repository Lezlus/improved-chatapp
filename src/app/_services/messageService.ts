import fetchData from "@/lib/fetchData";
import { MessageSchemaType } from "../../../types";
import { CreateMessageSchemaType, PopulatedMessageSchemaType } from "../../../types/messages";

interface GetMessageServiceResponse {
  success: boolean;
  messages: PopulatedMessageSchemaType[];
}

interface CreateMessageServiceResponse {
  success: boolean;
  message: PopulatedMessageSchemaType;
}

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