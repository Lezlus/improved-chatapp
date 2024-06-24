import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userDAO } from "../../DAO/user.dao";
import bcrypt from 'bcrypt';
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        console.log("authorize running")
        const { username, password } = credentials as {
          username: string;
          password: string;
        }
        try {
          const user = await userDAO.getUserByUsername(username);
          if (!user) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }

          return ({
            name: user.username,
            id: user._id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            messages: user.messages,
            friends: user.friends,
            friendInvites: user.friendInvites,
            groupChatInvites: user.groupChatInvites,
            groups: user.groups,
          } as any);
        } catch (e) {
          console.log(e);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 1000,
  },
  callbacks: {
    async jwt({ token, user, session, trigger }: { token: JWT, user: any, session?: any, trigger?: "signIn" | "signUp" | "update" | undefined }) {
      console.log("JWT Callback", { token, user, session });

      // User only defined on login. 
      // Only token defined 
      if (user) {
        token.name = user.name;
        token.id = user.id;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        token.messages = user.messages;
        token.friends = user.friends;
        token.friendInvites = user.friendInvites;
        token.groupChatInvites = user.groupChatInvites;
        token.groups = user.groups;
      }
      if (trigger === "update" && (session?.friends && session?.friendInvites)) {
        console.log("TRIGGER DETECTED");
        token.friends = session.friends;
        token.friendInvites = session.friendInvites
      }
      return token;
    },
    async session({ session, token, user }:{ session: any, token: any, user: any }) {
      // Token and session defined. User only defined on login
      if (session.user) {
        session.user.name = token.name;
        session.user.id = token.id;
        session.user.createdAt = token.createdAt;
        session.user.messages = token.messages;
        session.user.friends = token.friends;
        session.user.friendInvites = token.friendInvites;
        session.user.groupChatInvites = token.groupChatInvites;
        session.user.groups = token.groups;
        session.user.updatedAt = token.updatedAt;
      }
      console.log("SESSION CALLED", { session, token, user });
      return session;
    }
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: "/login",
  }
}