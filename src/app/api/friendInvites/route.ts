import { NextResponse } from "next/server";
import { friendInviteDAO } from "../../../../DAO/friendInvite.dao";
import { validateCreteFriendInviteSchema } from "../../../../types/friendInvites";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const data = validateCreteFriendInviteSchema(body);
    await friendInviteDAO.createFriendInvite(data);
    return NextResponse.json({ success: true }, { status: 201, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }, });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 404 });
  }
}