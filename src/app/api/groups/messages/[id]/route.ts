import { NextResponse } from "next/server";
import { groupDAO } from "../../../../../../DAO/group.dao";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const messages = await groupDAO.getGroupMessages(id);
    return NextResponse.json({ success: true, messages }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}