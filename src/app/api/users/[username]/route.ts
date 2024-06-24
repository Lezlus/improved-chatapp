import { NextResponse } from "next/server";
import { userDAO } from "../../../../../DAO/user.dao";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;
  try {
    const user = await userDAO.getUserByUsernameUnPopulated(username);
    return NextResponse.json({ success: true, user }, { status: 201, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }, });
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}