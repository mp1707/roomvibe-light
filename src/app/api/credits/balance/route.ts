import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CreditBalanceResponse } from "@/types/credits";

export async function GET(request: NextRequest) {
  console.log("=== CREDITS BALANCE API START ===");

  try {
    // Initialize Supabase client
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return NextResponse.json(
        {
          success: false,
          error: "User not authenticated",
        } as CreditBalanceResponse,
        { status: 401 }
      );
    }

    console.log("Fetching credits for user:", user.id);

    // Get user's current credits from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);

      // If profile doesn't exist, create it with 0 credits
      if (profileError.code === "PGRST116") {
        console.log("Profile doesn't exist, creating new profile");

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            full_name:
              user.user_metadata?.full_name || user.user_metadata?.name || null,
            credits: 10, // Welcome bonus
          })
          .select("credits")
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          return NextResponse.json(
            {
              success: false,
              error: "Failed to create user profile",
            } as CreditBalanceResponse,
            { status: 500 }
          );
        }

        // Create welcome bonus transaction
        await supabase.from("credit_transactions").insert({
          user_id: user.id,
          type: "bonus",
          amount: 10,
          balance_after: 10,
          description: "Willkommensbonus - 10 gratis Credits!",
        });

        console.log("New profile created with welcome bonus");

        return NextResponse.json({
          success: true,
          credits: newProfile.credits,
        } as CreditBalanceResponse);
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch user credits",
        } as CreditBalanceResponse,
        { status: 500 }
      );
    }

    console.log("User credits:", profile.credits);

    return NextResponse.json({
      success: true,
      credits: profile.credits,
    } as CreditBalanceResponse);
  } catch (error) {
    console.error("Credits balance API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      } as CreditBalanceResponse,
      { status: 500 }
    );
  }
}
