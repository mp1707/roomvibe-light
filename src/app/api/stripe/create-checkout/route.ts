import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getStripe } from "@/utils/stripe";
import {
  StripeCheckoutRequest,
  StripeCheckoutResponse,
  CREDIT_PACKAGES,
} from "@/types/credits";

export async function POST(request: NextRequest) {
  console.log("=== STRIPE CREATE CHECKOUT API START ===");

  try {
    // Parse request body
    const body: StripeCheckoutRequest = await request.json();
    const { packageId, successUrl, cancelUrl } = body;

    // Validate input
    if (!packageId) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID is required",
        } as StripeCheckoutResponse,
        { status: 400 }
      );
    }

    // Find the credit package
    const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);
    if (!creditPackage) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package ID",
        } as StripeCheckoutResponse,
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
        } as StripeCheckoutResponse,
        { status: 401 }
      );
    }

    console.log("Creating checkout for user:", user.id, "Package:", packageId);

    // Initialize Stripe
    const stripe = getStripe();

    // Check if user already has a Stripe customer ID
    let stripeCustomerId: string;

    const { data: existingCustomer } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      stripeCustomerId = existingCustomer.stripe_customer_id;
      console.log("Using existing Stripe customer:", stripeCustomerId);
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email || "",
        metadata: {
          user_id: user.id,
          app: "roomvibe",
        },
      });

      stripeCustomerId = customer.id;
      console.log("Created new Stripe customer:", stripeCustomerId);

      // Save the customer ID to database
      const { error: customerError } = await supabase
        .from("stripe_customers")
        .insert({
          user_id: user.id,
          stripe_customer_id: stripeCustomerId,
          email: user.email || "",
        });

      if (customerError) {
        console.error("Error saving Stripe customer:", customerError);
        // Continue anyway - the customer was created in Stripe
      }
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${creditPackage.name} Credit-Paket`,
              description: `${creditPackage.credits} Credits für RoomVibe`,
              metadata: {
                package_id: packageId,
                credits: creditPackage.credits.toString(),
              },
            },
            unit_amount: Math.round(creditPackage.priceEur * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        successUrl ||
        `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/buy-credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl ||
        `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/buy-credits?canceled=true`,
      metadata: {
        user_id: user.id,
        package_id: packageId,
        credits: creditPackage.credits.toString(),
        app: "roomvibe",
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      invoice_creation: {
        enabled: true,
      },
    });

    console.log("Checkout session created:", session.id);

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    } as StripeCheckoutResponse);
  } catch (error) {
    console.error("Stripe checkout API error:", error);

    // Handle Stripe-specific errors
    if (error && typeof error === "object" && "type" in error) {
      const stripeError = error as any;
      return NextResponse.json(
        {
          success: false,
          error: `Stripe error: ${stripeError.message}`,
        } as StripeCheckoutResponse,
        { status: 400 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
        } as StripeCheckoutResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      } as StripeCheckoutResponse,
      { status: 500 }
    );
  }
}
