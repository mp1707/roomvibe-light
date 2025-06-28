import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export async function GET(request: NextRequest) {
  const { searchParams, pathname } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  // Extract locale from pathname (e.g., /de/auth/callback -> "de")
  const pathSegments = pathname.split("/").filter(Boolean);
  const locale =
    pathSegments[0] && routing.locales.includes(pathSegments[0] as any)
      ? pathSegments[0]
      : routing.defaultLocale;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect({ href: next, locale });
    }
  }

  // return the user to an error page with instructions
  return redirect({ href: "/auth/error", locale });
}
