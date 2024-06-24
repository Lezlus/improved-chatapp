import { NextResponse } from "next/server";
import { friendInviteDAO } from "../../../../../DAO/friendInvite.dao";
import { validateGetFriendInviteSchema } from "../../../../../types/friendInvites";

export async function GET(request: Request) {
  const body = await request.json();
  try {
    const data = validateGetFriendInviteSchema(body);
    const friendInvites = await friendInviteDAO.getOutGoingFriendInvites({ id: data.id });
    return NextResponse.json({ success: true, outGoingFriendInvites: friendInvites }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 })
  }
}