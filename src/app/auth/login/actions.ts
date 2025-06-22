"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !password) {
    redirect(
      "/auth/error?message=" +
        encodeURIComponent("Email and password are required")
    );
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    redirect("/auth/error?message=" + encodeURIComponent(error.message));
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !password) {
    redirect(
      "/auth/error?message=" +
        encodeURIComponent("Email and password are required")
    );
  }

  if (password.length < 6) {
    redirect(
      "/auth/error?message=" +
        encodeURIComponent("Password must be at least 6 characters long")
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Signup error:", error.message);
    redirect("/auth/error?message=" + encodeURIComponent(error.message));
  }

  // Check if email confirmation is required
  if (data.user && !data.user.email_confirmed_at) {
    redirect("/auth/check-email");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"
      }/auth/callback`,
    },
  });

  if (error) {
    console.error("Google auth error:", error.message);
    redirect("/auth/error?message=" + encodeURIComponent(error.message));
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/auth/error?message=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/auth/login");
}
