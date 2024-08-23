import { toPusherKey } from "@/lib/toPusherKey"
import { sortObjectIds } from "@/lib/sortObjectId";

export const pusherFriendInviteChannelName = (id: string) => {
  return toPusherKey(`friendInvite:${id}`);
}

export const pusherGroupChatChannelName = (id: string) => {
  return toPusherKey(`groupChat:${id}`);
}

export const pusherGroupChatInviteChannelName = (id: string) => {
  return toPusherKey(`groupChatInvite:${id}`);
}

export const pusherDirectMessageChannelName = (userId: string, friendId: string) => {
  return toPusherKey(`chat:${sortObjectIds(userId, friendId)}`);
}

export const pusherActivityStatusChannelName = (userId: string) => {
  return toPusherKey(`presence-activityStatus:${userId}`);
}

export enum DirectMessageEvents {
  Incoming = "Incoming-Message",
}

export enum FriendInviteEvents {
  Accepted = "Friend-Invite-Accepted",
  Incoming = "Friend-Invite-Incoming",
}

export enum GroupChatInviteEvents {
  InviteIncoming = "Group-Chat-Invite-Incoming",
}

export enum GroupChatEvents {
  InviteAccepted = "Group-Chat-Invite-Accepted",
  InviteDeclined = "Group-Chat-Invite-Declined",
  Messaging = "Group-Chat-Messaging"
}

export enum ActivityStatusEvents {
  SubscriptionSucceeded = "pusher:subscription_succeeded",
  StatusChange = "Activity-Status-Change",
  StatusOnline = "Activity-Status-Online",
  StatusOffline = "Activity-Status-Offline"
}