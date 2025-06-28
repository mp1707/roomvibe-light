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
     * Match all request paths except for:
     * - API routes (/api)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
