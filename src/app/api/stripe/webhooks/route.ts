import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getStripe, getWebhookSecret } from "@/utils/stripe";
import { CREDIT_PACKAGES } from "@/types/credits";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  console.log("=== STRIPE WEBHOOK API START ===");

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = getWebhookSecret();
    const stripe = getStripe();

    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("Webhook event type:", event.type);

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "payment_intent.succeeded":
        console.log("Payment intent succeeded:", event.data.object.id);
        // Additional handling if needed
        break;

      case "payment_intent.payment_failed":
        console.log("Payment intent failed:", event.data.object.id);
        // Handle failed payments if needed
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("Processing checkout session completed:", session.id);

  // Extract metadata
  const userId = session.metadata?.user_id;
  const packageId = session.metadata?.package_id;
  const creditsString = session.metadata?.credits;

  if (!userId || !packageId || !creditsString) {
    console.error("Missing required metadata in session:", {
      userId,
      packageId,
      creditsString,
    });
    throw new Error("Missing required metadata");
  }

  const credits = parseInt(creditsString, 10);
  if (isNaN(credits) || credits <= 0) {
    console.error("Invalid credits amount:", creditsString);
    throw new Error("Invalid credits amount");
  }

  // Verify the package exists and matches
  const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);
  if (!creditPackage || creditPackage.credits !== credits) {
    console.error("Package verification failed:", {
      packageId,
      credits,
      creditPackage,
    });
    throw new Error("Package verification failed");
  }

  // Check if this session was already processed (idempotency)
  const supabase = await createClient();

  const { data: existingTransaction } = await supabase
    .from("credit_transactions")
    .select("id")
    .eq("reference_id", session.id)
    .eq("type", "purchase")
    .single();

  if (existingTransaction) {
    console.log("Session already processed:", session.id);
    return;
  }

  console.log(
    `Adding ${credits} credits to user ${userId} for session ${session.id}`
  );

  // Use the database function to add credits
  const { data: result, error: addError } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: credits,
    p_description: `Kauf: ${creditPackage.name} Credit-Paket (${credits} Credits)`,
    p_reference_id: session.id,
    p_metadata: {
      stripe_session_id: session.id,
      stripe_customer_id: session.customer,
      package_id: packageId,
      amount_paid: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
    },
  });

  if (addError) {
    console.error("Error adding credits:", addError);
    throw new Error(`Failed to add credits: ${addError.message}`);
  }

  // Parse the JSONB result
  const addResult = result as {
    success: boolean;
    credits?: number;
    error?: string;
    transaction_id?: string;
  };

  if (!addResult.success) {
    console.error("Credits addition failed:", addResult.error);
    throw new Error(`Credits addition failed: ${addResult.error}`);
  }

  console.log(
    `Successfully added ${credits} credits to user ${userId}. New balance: ${addResult.credits}`
  );

  // Optional: Send confirmation email or notification here
  // await sendPurchaseConfirmationEmail(userId, credits, creditPackage);
}

// Optional: Configure webhook endpoints for different environments
export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we need the raw body for signature verification
  },
};

// We need to export all HTTP methods that we want to handle
export const GET = async () => {
  return NextResponse.json(
    { message: "Webhook endpoint is active" },
    { status: 200 }
  );
};
