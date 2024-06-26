import { NextResponse } from "next/server";
import { validateCreateMessageSchema } from "../../../../types/clientSchemas/messages";
import { messageDAO } from "../../../../DAO/message.dao";
import { pusherServer } from "@/lib/pusher";
import { sortObjectIds } from "@/lib/sortObjectId";
import { toPusherKey } from "@/lib/toPusherKey";

export async function POST(request: Request) {
  console.log("IN MESSAGES POST")
  const body = await request.json();
  try {
    const data = validateCreateMessageSchema(body);
    const message = await messageDAO.createMessage(data);

    if (data.receiverId) {
      // Private DM
      await pusherServer.trigger(toPusherKey(`chat:${sortObjectIds(data.senderId, data.receiverId)}`), "incoming-message", message)

    }
    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 404 })
  }
}
