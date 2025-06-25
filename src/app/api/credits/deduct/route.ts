import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  CreditDeductionRequest,
  CreditDeductionResponse,
} from "@/types/credits";

export async function POST(request: NextRequest) {
  console.log("=== CREDITS DEDUCT API START ===");

  try {
    // Parse request body
    const body: CreditDeductionRequest = await request.json();
    const { amount, description, reference_id, metadata = {} } = body;

    // Validate input
    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credit amount",
        } as CreditDeductionResponse,
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Description is required",
        } as CreditDeductionResponse,
        { status: 400 }
      );
    }

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
        } as CreditDeductionResponse,
        { status: 401 }
      );
    }

    console.log(
      "Deducting credits for user:",
      user.id,
      "Amount:",
      amount,
      "Description:",
      description
    );

    // Use the database function to safely deduct credits
    const { data: result, error: deductError } = await supabase.rpc(
      "deduct_credits",
      {
        p_user_id: user.id,
        p_amount: amount,
        p_description: description,
        p_reference_id: reference_id || null,
        p_metadata: metadata,
      }
    );

    if (deductError) {
      console.error("Error calling deduct_credits function:", deductError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to deduct credits",
        } as CreditDeductionResponse,
        { status: 500 }
      );
    }

    // Parse the JSONB result
    const deductionResult = result as {
      success: boolean;
      credits?: number;
      error?: string;
      required?: number;
      transaction_id?: string;
    };

    if (!deductionResult.success) {
      console.log("Credit deduction failed:", deductionResult.error);

      if (deductionResult.error === "Insufficient credits") {
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient credits",
            credits: deductionResult.credits || 0,
            required: deductionResult.required || amount,
          } as CreditDeductionResponse,
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: deductionResult.error || "Failed to deduct credits",
        } as CreditDeductionResponse,
        { status: 400 }
      );
    }

    console.log(
      "Credits deducted successfully. New balance:",
      deductionResult.credits
    );

    return NextResponse.json({
      success: true,
      credits: deductionResult.credits,
      transaction_id: deductionResult.transaction_id,
    } as CreditDeductionResponse);
  } catch (error) {
    console.error("Credits deduct API error:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
        } as CreditDeductionResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      } as CreditDeductionResponse,
      { status: 500 }
    );
  }
}
