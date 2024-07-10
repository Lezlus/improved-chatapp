import { NextResponse } from "next/server";
import { validateGroupChatInviteSchema } from "../../../../../types/clientSchemas";
import { groupChatInviteDAO } from "../../../../../DAO/groupChatInvite.dao";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const validatedGroupChatInvite = validateGroupChatInviteSchema(body);
    await groupChatInviteDAO.declineGroupChatInvite(validatedGroupChatInvite);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 404 });
  }
}