import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = await getToken({
    req, 
    secret: process.env.AUTH_SECRET
  })
  const publicPaths = path === "/login" || path === "/register";

  // User signed in but trying to access login or register
  if (publicPaths && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!publicPaths && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/", "/register", "/login"]
}