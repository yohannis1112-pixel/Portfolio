import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
 
export default withAuth(
  function middleware(req) {
    // Allow access to login page
    if (req.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }
    
    // Redirect to login if not authenticated
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