import { NextResponse } from "next/server";
import { groupDAO } from "../../../../../DAO/group.dao";

export async function GET(request: Request, { params }: { params: { name: string } }) {
  const { name } = params;
  try {
    const group = await groupDAO.getGroup(name);
    if (group) {
      return NextResponse.json({ success: true, group }, { status: 200 });
    } else {
      return NextResponse.json({ success: false }, { status: 200 })
    }
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}
