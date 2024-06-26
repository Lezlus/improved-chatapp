import { NextResponse } from "next/server";
import { friendInviteDAO } from "../../../../DAO/friendInvite.dao";
import { validateCreteFriendInviteSchema } from "../../../../types/clientSchemas/friendInvites";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/toPusherKey";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const data = validateCreteFriendInviteSchema(body);
    const newFriendInvite = await friendInviteDAO.createFriendInvite(data);
    await pusherServer.trigger(toPusherKey(`friendInvite:${data.receiver}`), 'incoming-friendinvite', newFriendInvite);
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 404 });
  }
}