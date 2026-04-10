import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
 
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Allow login page always
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Allow Next.js server actions (they POST to the page URL)
    const isServerAction = req.headers.get("next-action") !== null;
    if (isServerAction) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/admin/login",
    },
  }
);
 
export const config = {
  matcher: ["/admin/:path*"],
};