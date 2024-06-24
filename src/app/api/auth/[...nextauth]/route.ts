import NextAuth, { AuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { userDAO } from "../../../../../DAO/user.dao";
import bcrypt from 'bcrypt';
import { validateUsersSchema } from "../../../../../types/users";
import { JWT } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };