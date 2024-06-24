import { NextResponse } from "next/server";
import { validateUpdateFriendInviteSchema } from "../../../../../types/friendInvites";
import { friendInviteDAO } from "../../../../../DAO/friendInvite.dao";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { _id, receiver, sender } = validateUpdateFriendInviteSchema(body);
    // Change Friend Invite doc from Pending to Accepted
    let user = await friendInviteDAO.declineFriendInvite(_id, sender, receiver);
    return NextResponse.json({ success: true, friendInvites: user?.friendInvites, friends: user?.friends }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}