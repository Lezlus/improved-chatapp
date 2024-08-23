import { ActivityStatusType } from "../../../../../modelSchemas/users";

export type MainViews =  "DIRECT" | "GROUP" | "FRIENDS";
export const activityStatusText = (status: ActivityStatusType) => {
  switch (status) {
    case "ONLINE":
      return "Online";
    case "AWAY": 
      return "Away";
    case "DO NOT DISTURB": 
      return "Do Not Disturb";
    case "IDLE":
      return "Offline";
    case "OFFLINE":
      return "Offline"
    default:
      return "Offline"
  }
}

export const activityStatusColor = (status: ActivityStatusType) => {
  switch (status) {
    case "ONLINE":
      return "green.500";
    case "AWAY": 
      return "#ecb511";
    case "DO NOT DISTURB": 
      return "#ef1e1e";
    case "IDLE":
      return "#afabab";
    case "OFFLINE":
      return "#afabab"
    default:
      return "#afabab"
  }
}
