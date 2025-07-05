import { NextRequest, NextResponse } from "next/server";
import { auth } from "./config/auth/auth";

export async function middleware(req: NextRequest) {
  const session = await auth(); 
  const { pathname } = req.nextUrl;

  const publicPaths = ["/login", "/register"];

  if (!session?.user && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }


  if (session?.user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/home", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)"
  ],
};

