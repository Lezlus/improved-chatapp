import { NextResponse } from "next/server";
import { validateCreateMessageSchema } from "../../../../types/clientSchemas/messages";
import { messageDAO } from "../../../../DAO/message.dao";
import { pusherServer } from "@/lib/pusher";
import { sortObjectIds } from "@/lib/sortObjectId";
import { toPusherKey } from "@/lib/toPusherKey";
import { pusherDirectMessageChannelName, DirectMessageEvents, pusherGroupChatChannelName, GroupChatEvents } from "../../../../types/pusher";

export async function POST(request: Request) {
  console.log("IN MESSAGES POST")
  const body = await request.json();
  try {
    const data = validateCreateMessageSchema(body);
    const message = await messageDAO.createMessage(data);

    if (data.receiverId && !data.groupId) {
      // Private DM
      await pusherServer.trigger(pusherDirectMessageChannelName(data.senderId, data.receiverId), DirectMessageEvents.Incoming, message)
    } else if (data.groupId) {
      await pusherServer.trigger(pusherGroupChatChannelName(data.groupId), GroupChatEvents.Messaging, message);
    }
    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 404 })
  }
}
