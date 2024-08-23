import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/lib/pusher";
import { validateUsersSchema } from "../../../../../types/clientSchemas";

export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const socket_id = params.get("socket_id")!;
  const channel_name = params.get("channel_name")!;
  console.log(socket_id, channel_name);
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      if (session.user) {
        // Authenticated by knowing user is in our DB
        const user = validateUsersSchema(session.user);
        console.log(user);
        const auth = pusherServer.authorizeChannel(socket_id, channel_name, {
          user_id: user.id,
          user_info: {
            username: user.name,
            activityStatus: user.activityStatus,
            online: user.online
          }
        })
        return new Response(JSON.stringify(auth))
      }
    } else {
      return NextResponse.json({success: false}, { status: 404 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 500 });
  }
}