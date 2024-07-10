import { NextResponse } from "next/server";
import { validateUpdateFriendInviteSchema } from "../../../../../types/clientSchemas/friendInvites";
import { friendInviteDAO } from "../../../../../DAO/friendInvite.dao";
import { userDAO } from "../../../../../DAO/user.dao";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/toPusherKey";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { _id, receiver, sender } = validateUpdateFriendInviteSchema(body);
    // Change Friend Invite doc from Pending to Accepted
    const user = await friendInviteDAO.acceptFriendInvite(_id, sender, receiver);
    const receiverUser = await userDAO.getUserByIdUnpopulated(receiver);

    await pusherServer.trigger(toPusherKey(`friendInvite:${sender}`), "accepted-friendinvite", receiverUser);
    return NextResponse.json({ 
      success: true, 
      friends: user?.friends, 
      friendInvites: user?.friendInvites 
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ err, success: false }, { status: 404 });
  }
}