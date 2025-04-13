import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Skip middleware for API routes and auth pages
    if (req.nextUrl.pathname.startsWith('/api/') || 
        req.nextUrl.pathname.startsWith('/auth/') ||
        req.nextUrl.pathname.startsWith('/signin') ||
        req.nextUrl.pathname.startsWith('/signup')) {
      return null
    }

    const token = req.nextauth.token
    const isAuth = !!token
    const isDashboardPage = req.nextUrl.pathname.startsWith("/candidate/dashboard") || 
                          req.nextUrl.pathname.startsWith("/recruiter/dashboard")

    if (isDashboardPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/signin", req.url))
      }
      
      // Check if user has access to the specific dashboard
      const userType = token?.userType
      const isCandidateDashboard = req.nextUrl.pathname.startsWith("/candidate/dashboard")
      const isRecruiterDashboard = req.nextUrl.pathname.startsWith("/recruiter/dashboard")
      
      if ((isCandidateDashboard && userType !== "candidate") || 
          (isRecruiterDashboard && userType !== "recruiter")) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ["/candidate/dashboard/:path*", "/recruiter/dashboard/:path*"]
} 