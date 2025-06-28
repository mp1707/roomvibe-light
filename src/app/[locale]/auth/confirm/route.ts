import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export async function GET(request: NextRequest) {
  const { searchParams, pathname } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  // Extract locale from pathname (e.g., /de/auth/confirm -> "de")
  const pathSegments = pathname.split("/").filter(Boolean);
  const locale =
    pathSegments[0] && routing.locales.includes(pathSegments[0] as any)
      ? pathSegments[0]
      : routing.defaultLocale;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect({ href: next, locale });
    }
  }

  // redirect the user to an error page with some instructions
  redirect({ href: "/auth/error", locale });
}
