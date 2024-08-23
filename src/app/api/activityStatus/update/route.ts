import { userDAO } from "../../../../../DAO/user.dao";
import { NextResponse } from "next/server";
import { validateChangeActivityStatus, validateChangeOnlineActivity } from "../../../../../types/clientSchemas/activityStatus";
import { pusherActivityStatusChannelName, ActivityStatusEvents } from "../../../../../types/pusher";
import { pusherServer } from "@/lib/pusher";


export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = await validateChangeActivityStatus(body);
  if (!validatedBody.success) {
    return NextResponse.json({ msg: "Error" }, { status: 500 })
  }
  const { id, activityStatus } = validatedBody.data
  const user = await userDAO.updateActivityStatus(id, activityStatus)
  // Add event trigger
  if (user) {
    await pusherServer.trigger(pusherActivityStatusChannelName(id), ActivityStatusEvents.StatusChange, user);
    return NextResponse.json({ user, success: true }, { status: 201 })
  }
  return NextResponse.json({ msg: "Error", success: false }, { status: 404 })
}