import { userDAO } from "../../../../../DAO/user.dao";
import { NextResponse } from "next/server";
import { validateChangeActivityStatus, validateChangeOnlineActivity } from "../../../../../types/clientSchemas/activityStatus";
import { ActivityStatusEvents, pusherActivityStatusChannelName } from "../../../../../types/pusher";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = await validateChangeActivityStatus(body);

  if (!validatedBody.success) {
    return NextResponse.json({ msg: "Error" }, { status: 500 })
  }

  const { id, activityStatus } = validatedBody.data;
  const user = await userDAO.goOnline(id, activityStatus);
  if (user) {
    await pusherServer.trigger(pusherActivityStatusChannelName(id), ActivityStatusEvents.StatusOnline, user);
    return NextResponse.json({ success: true, user }, { status: 201 });
  }
  return NextResponse.json({ msg: "Error" }, { status: 404 });

}