import { userDAO } from "../../../../../DAO/user.dao";
import { NextResponse } from "next/server";
import { validateChangeActivityStatus, validateChangeOnlineActivity } from "../../../../../types/clientSchemas/activityStatus";
import { pusherActivityStatusChannelName, ActivityStatusEvents } from "../../../../../types/pusher";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  console.log("User going offline")
  const body = await request.json()
  console.log("BODY ", body);
  const validatedBody = await validateChangeActivityStatus(body);

  if (!validatedBody.success) {
    return NextResponse.json({ msg: "Error" }, { status: 500 })
  }

  const { id, activityStatus } = validatedBody.data;
  console.log(id, activityStatus);
  const user = await userDAO.goOffline(id, activityStatus);

  if (user) {
    await pusherServer.trigger(pusherActivityStatusChannelName(id), ActivityStatusEvents.StatusOffline, user);
    return NextResponse.json({ user }, { status: 201 });
  }
  return NextResponse.json({ msg: "Error" }, { status: 404 });

}