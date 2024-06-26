import { NextResponse } from "next/server";
import { validateUpdateFriendInviteSchema } from "../../../../../types/clientSchemas/friendInvites";
import { friendInviteDAO } from "../../../../../DAO/friendInvite.dao";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { _id, receiver, sender } = validateUpdateFriendInviteSchema(body);
    // Change Friend Invite doc from Pending to Accepted
    let user = await friendInviteDAO.acceptFriendInvite(_id, sender, receiver);
    return NextResponse.json({ 
      success: true, 
      friends: user?.friends, 
      friendInvites: user?.friendInvites 
    }, { status: 201, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }, });
  } catch (err) {
    return NextResponse.json({ err, success: false }, { status: 404 });
  }
}