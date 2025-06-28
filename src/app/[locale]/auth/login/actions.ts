"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/server";
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

export async function login(formData: FormData) {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !password) {
    redirect({
      href:
        "/auth/error?message=" +
        encodeURIComponent("Email and password are required"),
      locale,
    });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    redirect({
      href: "/auth/error?message=" + encodeURIComponent(error.message),
      locale,
    });
  }
  revalidatePath("/", "layout");
  redirect({ href: "/", locale });
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !password) {
    redirect({
      href:
        "/auth/error?message=" +
        encodeURIComponent("Email and password are required"),
      locale,
    });
  }

  if (password.length < 6) {
    redirect({
      href:
        "/auth/error?message=" +
        encodeURIComponent("Password must be at least 6 characters long"),
      locale,
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Signup error:", error.message);
    redirect({
      href: "/auth/error?message=" + encodeURIComponent(error.message),
      locale,
    });
  }

  // Check if email confirmation is required
  if (data.user && !data.user.email_confirmed_at) {
    redirect({ href: "/auth/check-email", locale });
  }

  revalidatePath("/", "layout");
  redirect({ href: "/", locale });
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google auth error:", error.message);
    redirect({
      href: "/auth/error?message=" + encodeURIComponent(error.message),
      locale,
    });
  }

  // For OAuth redirects, we need to use the external URL
  if (data.url) {
    redirect({ href: data.url, locale });
  }
}

export async function signOut() {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect({
      href: "/auth/error?message=" + encodeURIComponent(error.message),
      locale,
    });
  }

  revalidatePath("/", "layout");
  redirect({ href: "/auth/login", locale });
}
