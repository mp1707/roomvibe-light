"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { useCreditsStore } from "@/utils/creditsStore";
import { CreditTransaction, UserProfile } from "@/types/credits";
import {
  staggerContainer,
  staggerItem,
  cardVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";

interface GeneratedImage {
  id: string;
  original_url: string;
  generated_url: string;
  created_at: string;
  suggestions_applied: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const reducedMotion = useMotionPreference();
  const {
    credits,
    isLoading: creditsLoading,
    fetchCredits,
  } = useCreditsStore();

  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const supabase = createClient();

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      // Fetch recent transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (transactionData) {
        setTransactions(transactionData);
      }

      // Fetch generated images (mock data for now - would need proper storage structure)
      // This would be implemented when we have a proper generated images table
      setGeneratedImages([]);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Fehler beim Laden der Profildaten");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchUserData();
    fetchCredits();
  }, [fetchUserData, fetchCredits]);

  // Debug: Log activeTab changes
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-base-content/60">Profil wird geladen...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Benutzer";
  const joinDate = userProfile?.created_at
    ? new Date(userProfile.created_at).toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unbekannt";

  return (
    <motion.div
      variants={reducedMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-base-100 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="bg-base-100 backdrop-blur-sm border border-base-300 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6">
            {/* Avatar */}
            <motion.div
              className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </motion.div>

            {/* User Info */}
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content">
                {displayName}
              </h1>
              <p className="text-base-content/60 text-base sm:text-lg break-all sm:break-normal">
                {user.email}
              </p>
              <p className="text-base-content/50 text-sm">
                Mitglied seit {joinDate}
              </p>
            </div>

            {/* Credits Display */}
            <motion.div
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 sm:p-6 border border-primary/20 w-full md:w-auto"
              variants={reducedMotion ? {} : cardVariants}
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg
                    className="w-6 h-6 text-warning"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-lg font-semibold text-base-content">
                    Ihre Credits
                  </span>
                </div>
                {creditsLoading ? (
                  <div className="w-16 h-8 bg-base-300 rounded-lg animate-pulse mx-auto" />
                ) : (
                  <motion.div
                    className="text-3xl font-bold text-primary"
                    key={credits}
                    initial={{ scale: 1.2, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {(credits ?? 0).toLocaleString()}
                  </motion.div>
                )}
                <Link href="/buy-credits">
                  <motion.button
                    variants={reducedMotion ? {} : buttonVariants}
                    whileHover={reducedMotion ? {} : "hover"}
                    whileTap={reducedMotion ? {} : "tap"}
                    className="px-4 py-2 bg-primary text-primary-content rounded-xl text-sm font-medium hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Credits kaufen
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="flex flex-col sm:flex-row gap-2 bg-base-200 rounded-2xl p-2"
        >
          {[
            { id: "overview", label: "Übersicht", icon: "👤" },
            { id: "history", label: "Transaktionen", icon: "📊" },
            { id: "images", label: "Generierte Bilder", icon: "🖼️" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                console.log("Tab clicked:", tab.id);
                setActiveTab(tab.id);
              }}
              className={`flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-1 sm:flex-none ${
                activeTab === tab.id
                  ? "bg-primary text-primary-content shadow-md"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <span className="text-lg sm:text-base">{tab.icon}</span>
              <span className="text-sm sm:text-base">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              variants={reducedMotion ? {} : staggerContainer}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-base-100 border border-base-300 rounded-2xl p-6 space-y-4"
              >
                <h3 className="text-xl font-semibold text-base-content">
                  Schnelle Statistiken
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">
                      Gesamte Bilder:
                    </span>
                    <span className="font-semibold text-base-content">
                      {generatedImages.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">
                      Credits ausgegeben:
                    </span>
                    <span className="font-semibold text-base-content">
                      {transactions
                        .filter((t) => t.type === "deduction")
                        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">
                      Credits gekauft:
                    </span>
                    <span className="font-semibold text-base-content">
                      {transactions
                        .filter((t) => t.type === "purchase")
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-base-100 border border-base-300 rounded-2xl p-6 space-y-4"
              >
                <h3 className="text-xl font-semibold text-base-content">
                  Letzte Aktivitäten
                </h3>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          transaction.type === "purchase"
                            ? "bg-green-500"
                            : transaction.type === "deduction"
                            ? "bg-red-500"
                            : transaction.type === "bonus"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-base-content truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-base-content/50">
                          {new Date(transaction.created_at).toLocaleDateString(
                            "de-DE"
                          )}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount}
                      </span>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <p className="text-base-content/50 text-sm text-center py-4">
                      Noch keine Aktivitäten
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-6 space-y-4"
              >
                <h3 className="text-xl font-semibold text-base-content">
                  Schnellaktionen
                </h3>
                <div className="space-y-3">
                  <Link href="/">
                    <motion.button
                      variants={reducedMotion ? {} : buttonVariants}
                      whileHover={reducedMotion ? {} : "hover"}
                      whileTap={reducedMotion ? {} : "tap"}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-primary-content rounded-xl font-medium hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Neues Bild hochladen
                    </motion.button>
                  </Link>
                  <Link href="/inspiration">
                    <motion.button
                      variants={reducedMotion ? {} : buttonVariants}
                      whileHover={reducedMotion ? {} : "hover"}
                      whileTap={reducedMotion ? {} : "tap"}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-base-200 text-base-content rounded-xl font-medium hover:bg-base-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Inspiration ansehen
                    </motion.button>
                  </Link>
                  <Link href="/settings">
                    <motion.button
                      variants={reducedMotion ? {} : buttonVariants}
                      whileHover={reducedMotion ? {} : "hover"}
                      whileTap={reducedMotion ? {} : "tap"}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-base-200 text-base-content rounded-xl font-medium hover:bg-base-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Einstellungen
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              variants={reducedMotion ? {} : cardVariants}
              className="bg-base-100 border border-base-300 rounded-2xl p-6"
            >
              <h3 className="text-2xl font-semibold text-base-content mb-6">
                Transaktionshistorie
              </h3>

              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-base-200 rounded-xl"
                      whileHover={{ scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            transaction.type === "purchase"
                              ? "bg-green-100 text-green-600"
                              : transaction.type === "deduction"
                              ? "bg-red-100 text-red-600"
                              : transaction.type === "bonus"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {transaction.type === "purchase"
                            ? "💳"
                            : transaction.type === "deduction"
                            ? "⚡"
                            : transaction.type === "bonus"
                            ? "🎁"
                            : "📄"}
                        </div>
                        <div>
                          <p className="font-medium text-base-content">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-base-content/60">
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString("de-DE", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount}
                        </p>
                        <p className="text-sm text-base-content/60">
                          Saldo: {transaction.balance_after}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    📊
                  </div>
                  <h4 className="text-lg font-semibold text-base-content mb-2">
                    Keine Transaktionen
                  </h4>
                  <p className="text-base-content/60 mb-6">
                    Sie haben noch keine Credit-Transaktionen getätigt.
                  </p>
                  <Link href="/buy-credits">
                    <motion.button
                      variants={reducedMotion ? {} : buttonVariants}
                      whileHover={reducedMotion ? {} : "hover"}
                      whileTap={reducedMotion ? {} : "tap"}
                      className="px-6 py-3 bg-primary text-primary-content rounded-xl font-medium hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Credits kaufen
                    </motion.button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "images" && (
            <motion.div
              variants={reducedMotion ? {} : cardVariants}
              className="bg-base-100 border border-base-300 rounded-2xl p-6"
            >
              <h3 className="text-2xl font-semibold text-base-content mb-6">
                Generierte Bilder
              </h3>

              {generatedImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedImages.map((image) => (
                    <motion.div
                      key={image.id}
                      className="bg-base-200 rounded-2xl overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={image.generated_url}
                          alt="Generiertes Bild"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-base-content/60">
                          {new Date(image.created_at).toLocaleDateString(
                            "de-DE"
                          )}
                        </p>
                        <p className="text-xs text-base-content/50 mt-1">
                          {image.suggestions_applied.length} Vorschläge
                          angewendet
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    🖼️
                  </div>
                  <h4 className="text-lg font-semibold text-base-content mb-2">
                    Keine generierten Bilder
                  </h4>
                  <p className="text-base-content/60 mb-6">
                    Sie haben noch keine Bilder mit unserer KI generiert.
                  </p>
                  <Link href="/">
                    <motion.button
                      variants={reducedMotion ? {} : buttonVariants}
                      whileHover={reducedMotion ? {} : "hover"}
                      whileTap={reducedMotion ? {} : "tap"}
                      className="px-6 py-3 bg-primary text-primary-content rounded-xl font-medium hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Erstes Bild hochladen
                    </motion.button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* Fallback content for debugging */}
          {activeTab !== "overview" &&
            activeTab !== "history" &&
            activeTab !== "images" && (
              <div className="bg-base-100 border border-base-300 rounded-2xl p-6 text-center">
                <p className="text-base-content">Unknown tab: {activeTab}</p>
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}
