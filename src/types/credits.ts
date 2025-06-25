// Credits system types for RoomVibe

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceEur: number;
  stripePriceId: string;
  popular?: boolean;
  savings?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: "purchase" | "deduction" | "refund" | "bonus";
  amount: number; // Positive for additions, negative for deductions
  balance_after: number;
  description: string;
  reference_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface StripeCustomer {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Stripe-related types
export interface StripeCheckoutRequest {
  packageId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface StripeCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

// Credit operations
export interface CreditDeductionRequest {
  amount: number;
  description: string;
  reference_id?: string;
  metadata?: Record<string, any>;
}

export interface CreditDeductionResponse {
  success: boolean;
  credits?: number;
  transaction_id?: string;
  error?: string;
  required?: number;
}

export interface CreditBalanceResponse {
  success: boolean;
  credits?: number;
  error?: string;
}

// Webhook types
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

// UI State types
export interface CreditState {
  credits: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// Action cost constants
export const CREDIT_COSTS = {
  IMAGE_ANALYSIS: 0,
  APPLY_SUGGESTION: 5,
} as const;

// Available credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    priceEur: 4.99,
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_50_CREDITS ||
      "price_test_50_credits",
  },
  {
    id: "professional",
    name: "Professional",
    credits: 1000,
    priceEur: 49.99,
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_1000_CREDITS ||
      "price_test_1000_credits",
    popular: true,
    savings: "50% günstiger",
  },
];

// Error types
export class InsufficientCreditsError extends Error {
  constructor(
    public required: number,
    public available: number,
    message = `Nicht genügend Credits. Benötigt: ${required}, Verfügbar: ${available}`
  ) {
    super(message);
    this.name = "InsufficientCreditsError";
  }
}

export class CreditOperationError extends Error {
  constructor(public operation: string, message: string) {
    super(message);
    this.name = "CreditOperationError";
  }
}
