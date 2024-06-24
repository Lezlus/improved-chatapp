import { NextResponse } from "next/server";
import { groupDAO } from "../../../../DAO/group.dao";
import { validateCreateGroupSchema, validateGetGroupSchema } from "../../../../types/groups";

export async function GET(request: Request) {
  const body = await request.json();
  try {
    const data = validateGetGroupSchema(body);
    const group = await groupDAO.getGroup(data.groupName);
    return NextResponse.json({ success: true, group }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const data = validateCreateGroupSchema(body);
    const group = await groupDAO.createGroup(data);
    return NextResponse.json({ success: true, group }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}