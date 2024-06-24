import Pusher from "pusher";
import pusherJs from "pusher-js";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: "us2",
  useTLS: true,
});

export const pusherClient = new pusherJs(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: 'us2'
});