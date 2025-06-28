import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";

// Helper function to extract locale from headers
async function getLocaleFromHeaders(): Promise<string> {
  const headersList = await headers();
  const referer = headersList.get("referer") || "";

  // Extract locale from referer URL (e.g., https://domain.com/de/auth/login -> "de")
  try {
    const url = new URL(referer);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const locale = pathSegments[0];

    if (locale && routing.locales.includes(locale as any)) {
      return locale;
    }
  } catch (error) {
    // If referer parsing fails, fall back to default
  }

  return routing.defaultLocale;
}

export async function getCurrentUser() {
  try {
    // Check if environment variables are set
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      console.warn("Supabase environment variables not configured");
      return null;
    }

    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  const locale = await getLocaleFromHeaders();

  if (!user) {
    redirect({ href: "/auth/login", locale });
  }

  return user;
}

export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();
  const locale = await getLocaleFromHeaders();

  if (user) {
    redirect({ href: "/", locale });
  }
}
