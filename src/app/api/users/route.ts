import { userDAO } from "../../../../DAO/user.dao";
import { NextResponse } from "next/server";
import { validateGetUserSchema } from "../../../../types/users";

export async function GET(request: Request) {
  console.log("ran /user")
  const body = await request.json();
  try {
    const data = validateGetUserSchema(body);
    const user = await userDAO.getUserByUsernameUnPopulated(data.username);
    return NextResponse.json({ success: true, user }, { status: 201, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }, });
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}