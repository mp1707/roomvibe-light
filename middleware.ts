import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  ...routing,
  // Ensure that the middleware handles locale detection and redirects
  localeDetection: true,
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return;
  }

  // First handle internationalization
  const intlResponse = intlMiddleware(request);

  // If intl middleware returns a response (redirect), return it
  if (intlResponse) {
    return intlResponse;
  }

  // Otherwise, continue with Supabase session management
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths since we handle exclusions in the middleware function
     */
    "/(.*)",
  ],
};
