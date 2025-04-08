import { ClerkProvider } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is authenticated by looking for the Clerk session cookie
  const hasSession = request.cookies.has("__session");

  // List of public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/signout",
    "/api/auth/signout",
    "/privacy",
    "/terms",
    "/about",
    "/contact"
  ];

  // Check if the requested path is a public route or Clerk-related route
  const isPublicRoute = (
    publicRoutes.some(route => request.nextUrl.pathname === route) ||
    request.nextUrl.pathname.startsWith('/api/clerk') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.includes('/sso-callback') ||
    request.nextUrl.pathname.includes('/oauth-callback')
  );

  // If the path is not public and there's no session, redirect to signin
  if (!hasSession && !isPublicRoute && !request.nextUrl.pathname.startsWith('/_next')) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Continue with the request if authenticated or accessing a public route
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};