import { messageDAO } from "../../../../../../DAO/message.dao";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const userIds = slug.split("-");
  const [ currentUserId, friendUserId ] = userIds;
  console.log("GET", currentUserId, friendUserId);
  try {
    const messages = await messageDAO.getMessagesBetweenUsers(currentUserId, friendUserId);
    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}