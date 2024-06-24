import { NextResponse } from "next/server";
import { friendInviteDAO } from "../../../../../../DAO/friendInvite.dao";
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const friendInvites = await friendInviteDAO.getOutGoingFriendInvites({ id });
    console.log(friendInvites);
    return NextResponse.json({ success: true, outGoingFriendInvites: friendInvites }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 })
  }
}