import { UserType, validateUsersSchema, validateRegisterLoginUser } from "../../../../../types/clientSchemas";
import { connect } from "../../../../../connection";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterAuthResponse } from "@/app/_services/types/response/auth";

export async function POST(req: NextRequest) {
  const { Users } = await connect();
  const body = await req.json();
  const { success, data, error } = await validateRegisterLoginUser(body);
  if (success) {
    const { username, password } = data;
    bcrypt.hash(password, 10, async (err, passwordHash) => {
      try {
        if (err) {
          throw err;
        }
        const prevSavedUser = await Users.findOne({ username })
        if (prevSavedUser) {
          return NextResponse.json<RegisterAuthResponse>({ message: { userTaken: true, msgError: true } }, { status: 409 });
        }
        await Users.create({
          username: username,
          password: passwordHash
        });
  
        return NextResponse.json<RegisterAuthResponse>({ message: { userTaken: false, msgError: false }}, { status: 201 });
      } catch (e) {
        return NextResponse.json({ err: e }, { status: 500 })
      }
    })
  } else {
    return NextResponse.json({ err: error }, { status: 404 })
  }
}