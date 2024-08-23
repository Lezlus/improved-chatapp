import { NextResponse } from "next/server";
import { friendInviteDAO } from "../../../../DAO/friendInvite.dao";
import { validateCreteFriendInviteSchema } from "../../../../types/clientSchemas/friendInvites";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/toPusherKey";
import { FriendInviteEvents, pusherFriendInviteChannelName } from "../../../../types/pusher";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const data = validateCreteFriendInviteSchema(body);
    const newFriendInvite = await friendInviteDAO.createFriendInvite(data);
    await pusherServer.trigger(pusherFriendInviteChannelName(data.receiver), FriendInviteEvents.Incoming, newFriendInvite);
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 404 });
  }
}