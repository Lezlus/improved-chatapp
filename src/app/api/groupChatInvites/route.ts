import { NextResponse } from "next/server";
import { validateCreateGroupChatInviteSchema, validateGroupChatInviteSchema } from "../../../../types/clientSchemas";
import { groupChatInviteDAO } from "../../../../DAO/groupChatInvite.dao"; 
import { pusherGroupChatInviteChannelName, GroupChatInviteEvents } from "../../../../types/pusher";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const validatedGroupChatInvite = validateCreateGroupChatInviteSchema(body);
    // Check if someone already sent an invite to the user
    const oldGroupChatInvite = await groupChatInviteDAO.getGroupChatInvite(validatedGroupChatInvite);
    if (oldGroupChatInvite) {
      return NextResponse.json({ groupChatInvite: oldGroupChatInvite, success: false }, { status: 201 });
    } else {
      const groupChatInvite = await groupChatInviteDAO.createGroupChatInvite(validatedGroupChatInvite);
      if (groupChatInvite) {
        await pusherServer.trigger(pusherGroupChatInviteChannelName(validatedGroupChatInvite.receiver), GroupChatInviteEvents.InviteIncoming, groupChatInvite);
      }
      return NextResponse.json({ groupChatInvite, success: true }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({error: error, success: false}, { status: 404 });
  }
}