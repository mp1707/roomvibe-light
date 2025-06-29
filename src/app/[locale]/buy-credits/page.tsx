"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { useCreditsStore } from "@/utils/creditsStore";
import { CREDIT_PACKAGES, StripeCheckoutResponse } from "@/types/credits";
import CreditPackageCard from "@/components/CreditPackageCard";

// Component that handles search params logic
const SearchParamsHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshCredits } = useCreditsStore();
  const t = useTranslations("BuyCreditsPage");

  // Check for success/cancel parameters
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      toast.success(t("paymentSuccess"), {
        duration: 5000,
      });
      // Refresh credits to show the new balance
      refreshCredits();
      // Clean up URL
      router.replace("/buy-credits");
    } else if (canceled === "true") {
      toast.error(t("paymentCanceled"));
      // Clean up URL
      router.replace("/buy-credits");
    }
  }, [searchParams, router, refreshCredits, t]);

  return null; // This component doesn't render anything
};

const BuyCreditsContent = () => {
  const router = useRouter();
  const locale = useLocale();
  const { credits, isLoading, fetchCredits } = useCreditsStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const t = useTranslations("BuyCreditsPage");

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(!!session?.user);

      if (session?.user) {
        await fetchCredits();
      }

      setIsPageLoading(false);
    };

    checkAuth();
  }, [fetchCredits]);

  const handlePurchase = async (packageId: string) => {
    if (!isAuthenticated) {
      toast.error(t("loginRequired"));
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          packageId,
          successUrl: `${window.location.origin}/${locale}/buy-credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/${locale}/buy-credits?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StripeCheckoutResponse = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || t("checkoutError"));
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error(error instanceof Error ? error.message : t("purchaseError"));
    }
  };

  // Loading state
  if (isPageLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-base-300 rounded w-1/3"></div>
          <div className="h-4 bg-base-300 rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-96 bg-base-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-base-content">{t("title")}</h1>
          <p className="text-base-content/70">{t("notAuthenticated")}</p>
          <motion.button
            className="btn btn-primary"
            onClick={() => router.push("/auth/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("signIn")}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-base-content">{t("title")}</h1>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </motion.div>

      {/* Current Balance */}
      <motion.div
        className="bg-base-100 border border-base-300 rounded-xl p-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <svg
            className="w-6 h-6 text-warning"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-lg font-medium text-base-content">
            {t("currentCredits")}
          </span>
        </div>
        {isLoading ? (
          <div className="w-16 h-8 bg-base-300 rounded animate-pulse mx-auto"></div>
        ) : (
          <motion.div
            className="text-3xl font-bold text-primary"
            key={credits} // Re-animate when credits change
            initial={{ scale: 1.2, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {(credits ?? 0).toLocaleString()}
          </motion.div>
        )}
      </motion.div>

      {/* Credit Usage Info */}
      <motion.div
        className="bg-info/10 border border-info/20 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-info"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {t("howCreditsUsed")}
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-base-content/80 font-medium">
              {t("uploadAnalyzeFree")}
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">5</span>
            </div>
            <span className="text-base-content/80">{t("aiGeneration")}</span>
          </div>
        </div>
      </motion.div>

      {/* Credit Packages */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-base-content text-center">
          {t("creditPackages")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CREDIT_PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            >
              <CreditPackageCard
                package={pkg}
                onPurchase={handlePurchase}
                disabled={isLoading}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Security Notice */}
      <motion.div
        className="text-center text-sm text-base-content/60 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4 text-success"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 1l3 3h5a1 1 0 011 1v11a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1h5l3-3zm0 2.414L8.586 5H3v10h14V5h-5.586L10 3.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>{t("securePayment")}</span>
        </div>
        <p>{t("securityNotice")}</p>
      </motion.div>
    </div>
  );
};

// Loading fallback component
const BuyCreditsLoading = () => (
  <div className="max-w-4xl mx-auto py-8 px-4">
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-base-300 rounded w-1/3 mx-auto"></div>
      <div className="h-4 bg-base-300 rounded w-2/3 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-96 bg-base-300 rounded-xl"></div>
        ))}
      </div>
    </div>
  </div>
);

// Main component wrapped with Suspense
const BuyCreditsPage = () => {
  return (
    <Suspense fallback={<BuyCreditsLoading />}>
      <SearchParamsHandler />
      <BuyCreditsContent />
    </Suspense>
  );
};

export default BuyCreditsPage;
