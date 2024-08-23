import fetchData from "@/lib/fetchData";
import { changeActivityStatusType, changeOnlineActivityType } from "../../../types/clientSchemas/activityStatus";
import { ActivityStatusResponse } from "./types/response/activityStatus";

class ActivityStatusService {
  static baseUrl = "/api/activityStatus";

  static update(data: changeActivityStatusType): Promise<ActivityStatusResponse> {
    return fetchData<ActivityStatusResponse>(`${this.baseUrl}/update`, {
      body: JSON.stringify(data),
      method: "POST",
      credentials: "include",
    })
  }

  static goOnline(data: changeActivityStatusType): Promise<ActivityStatusResponse> {
    return fetchData<ActivityStatusResponse>(`${this.baseUrl}/online`, {
      body: JSON.stringify(data),
      method: "POST",
      credentials: "include",
    })
  }

  static goOffline(data: changeActivityStatusType): Promise<ActivityStatusResponse> {
    return fetchData<ActivityStatusResponse>(`${this.baseUrl}/offline`, {
      body: JSON.stringify(data),
      method: "POST",
      credentials: "include",
      
    })
  }
}

export default ActivityStatusService;