// import { auth } from "./config/auth/auth"
// import { NextResponse } from "next/server"

// export default auth((req) => {
    
//     if (!req.auth && req.nextUrl.pathname !== "/login") {
//         const newUrl = new URL("/login", req.nextUrl.origin)
//         return NextResponse.redirect(newUrl)
//     }
    
//     if (req.auth && req.nextUrl.pathname === "/login") {
//         const newUrl = new URL("/home", req.nextUrl.origin)
//         return NextResponse.redirect(newUrl)
//     }

//     return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)"
// ],}




import { NextRequest, NextResponse } from "next/server";
import { auth } from "./config/auth/auth";

export async function middleware(req: NextRequest) {
  const session = await auth(); 
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  if (!session?.user && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  if (session?.user && pathname === "/login") {
    return NextResponse.redirect(new URL("/home", req.nextUrl.origin));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)"
  ],
};

