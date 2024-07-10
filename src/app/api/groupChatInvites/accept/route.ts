import { NextResponse } from "next/server";
import { validateGroupChatInviteSchema, GroupMembershipType } from "../../../../../types/clientSchemas";
import { groupChatInviteDAO } from "../../../../../DAO/groupChatInvite.dao";
import { groupMembershipDAO } from "../../../../../DAO/groupMembership.dao";
import { pusherGroupChatChannelName, GroupChatEvents } from "../../../../../types/pusher";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const validatedGroupChatInvite = validateGroupChatInviteSchema(body);
    const group = await groupChatInviteDAO.acceptGroupChatInvite(validatedGroupChatInvite);
    if (group) {
      const groupMembership = await groupMembershipDAO.get(validatedGroupChatInvite.group._id, validatedGroupChatInvite.receiver);
      if (groupMembership) {
        await pusherServer.trigger(pusherGroupChatChannelName(validatedGroupChatInvite.group._id), GroupChatEvents.InviteAccepted, groupMembership)
      }
    }
    return NextResponse.json({ group, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 404 });
  }
}