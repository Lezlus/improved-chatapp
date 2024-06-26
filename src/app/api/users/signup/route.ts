import { UserType, validateUsersSchema, validateRegisterLoginUser } from "../../../../../types/clientSchemas";
import { connect } from "../../../../../connection";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterAuthResponse } from "@/app/_services/types/response/auth";

export async function POST(req: NextRequest) {
  const { Users } = await connect();
  const body = await req.json();
  try {
    const { username, password } = validateRegisterLoginUser(body);
    bcrypt.hash(password, 10, async (err, passwordHash) => {
      if (err) {
        throw err;
      }
      const prevSavedUser = await Users.findOne({ username })
      if (prevSavedUser) {
        return NextResponse.json<RegisterAuthResponse>({ message: { userTaken: true, msgError: true } }, { status: 404 });
      }
      await Users.create({
        username: username,
        password: passwordHash
      });

      return NextResponse.json<RegisterAuthResponse>({ message: { userTaken: false, msgError: false }}, { status: 200 });
    })
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 404 })
  } finally {
    return NextResponse.json<RegisterAuthResponse>({ message: { userTaken: false, msgError: false }}, { status: 200 });

  }
}