import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// Server-side Stripe instance
let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    const secretKey =
      process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error("Stripe secret key is not configured");
    }

    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-05-28.basil", // Latest stable version
      typescript: true,
    });
  }

  return stripeInstance;
};

// Client-side Stripe instance
let stripePromise: Promise<any> | null = null;

export const getStripeClient = () => {
  if (!stripePromise) {
    const publishableKey =
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error("Stripe publishable key is not configured");
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

// Environment check
export const isStripeConfigured = (): boolean => {
  const hasSecretKey = !!(
    process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY
  );
  const hasPublishableKey = !!(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
  return hasSecretKey && hasPublishableKey;
};

// Webhook secret for signature verification
export const getWebhookSecret = (): string => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Stripe webhook secret is not configured");
  }
  return secret;
};

// Helper function to format amount for Stripe (convert EUR to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper function to format amount from Stripe (convert cents to EUR)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
