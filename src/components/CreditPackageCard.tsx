"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditPackage } from "@/types/credits";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

interface CreditPackageCardProps {
  package: CreditPackage;
  onPurchase: (packageId: string) => Promise<void>;
  disabled?: boolean;
}

const CreditPackageCard: React.FC<CreditPackageCardProps> = ({
  package: pkg,
  onPurchase,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Components.CreditPackageCard");

  const handlePurchase = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onPurchase(pkg.id);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pricePerCredit = pkg.priceEur / pkg.credits;

  return (
    <motion.div
      className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
        pkg.popular
          ? "border-primary bg-primary/5"
          : "border-base-300 bg-base-100 hover:border-primary/30"
      } ${disabled ? "opacity-50" : ""}`}
      whileHover={disabled ? {} : { scale: 1.02, y: -4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Popular Badge */}
      {pkg.popular && (
        <motion.div
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            delay: 0.1,
          }}
        >
          <span className="bg-primary text-primary-content px-3 py-1 rounded-full text-xs font-semibold">
            {t("popular")}
          </span>
        </motion.div>
      )}

      {/* Savings Badge */}
      {pkg.savings && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            delay: 0.2,
          }}
        >
          <span className="bg-success text-white px-2 py-1 rounded-lg text-xs font-medium">
            {pkg.savings}
          </span>
        </motion.div>
      )}

      <div className="text-center space-y-4">
        {/* Package Name */}
        <h3 className="text-xl font-semibold text-base-content">{pkg.name}</h3>

        {/* Credits Display */}
        <div className="space-y-2">
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <svg
              className="w-6 h-6 text-warning"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-3xl font-bold text-base-content">
              {pkg.credits.toLocaleString()}
            </span>
            <span className="text-base-content/60">Credits</span>
          </motion.div>

          {/* Price per credit */}
          <p className="text-sm text-base-content/60">
            {(pricePerCredit * 100).toFixed(1)}¢ pro Credit
          </p>
        </div>

        {/* Price */}
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-4xl font-bold text-primary">
            €{pkg.priceEur.toFixed(2)}
          </div>
          <p className="text-sm text-base-content/60">{t("oneTime")}</p>
        </motion.div>

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          variant={pkg.popular ? "primary" : "secondary"}
          size="base"
          fullWidth
          disabled={disabled}
          loading={isLoading}
        >
          {isLoading ? t("processing") : t("buyCredits")}
        </Button>

        {/* Features/Benefits */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-center gap-2 text-sm text-base-content/70">
            <svg
              className="w-4 h-4 text-success"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t("availableImmediately")}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-base-content/70">
            <svg
              className="w-4 h-4 text-success"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t("noExpiration")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditPackageCard;
