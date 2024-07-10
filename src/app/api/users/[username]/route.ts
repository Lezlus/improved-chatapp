import { NextResponse } from "next/server";
import { userDAO } from "../../../../../DAO/user.dao";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;
  try {
    const user = await userDAO.getUserByUsernameUnPopulated(username);
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}