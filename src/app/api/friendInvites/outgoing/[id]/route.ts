import { NextResponse } from "next/server";
import { friendInviteDAO } from "../../../../../../DAO/friendInvite.dao";
import { GetOutgoingFriendInviteServiceResponse } from "@/app/_services/types/response/friendInvites";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const friendInvites = await friendInviteDAO.getOutGoingFriendInvites({ id });
    if (friendInvites.length < 1) {
      return NextResponse.json({ success: false, outGoingFriendInvites: [] }, { status: 200 } );
    }
    return NextResponse.json({ success: true, outGoingFriendInvites: friendInvites }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ err, success: false }, { status: 404 })
  }
}