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
import { UserIcon, ChartBarIcon, PhotoIcon } from "@heroicons/react/24/outline";
import {
  staggerContainer,
  staggerItem,
  cardVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";

interface GeneratedImage {
  name: string;
  path: string;
  publicUrl: string;
  lastModified: string;
  size: number;
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
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const supabase = createClient();

  // Fetch generated images from Supabase storage
  const fetchGeneratedImages = useCallback(
    async (userId: string, showLoading = false) => {
      if (showLoading) setIsLoadingImages(true);

      try {
        console.log("🔍 Fetching generated images for user:", userId);

        // List all files in the user's generated folder
        const { data: files, error } = await supabase.storage
          .from("room-images")
          .list(`${userId}/generated`, {
            limit: 100,
            offset: 0,
            sortBy: { column: "created_at", order: "desc" },
          });

        if (error) {
          console.error("Error fetching generated images:", error);
          if (showLoading) toast.error("Fehler beim Laden der Bilder");
          setGeneratedImages([]);
          return;
        }

        if (!files || files.length === 0) {
          console.log("📷 No generated images found for user");
          setGeneratedImages([]);
          return;
        }

        // Get public URLs for all images
        const imagesWithUrls: GeneratedImage[] = files
          .filter((file) => {
            // Filter out any folders and only include image files
            const isImageFile = file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i);
            return isImageFile && file.name !== ".emptyFolderPlaceholder";
          })
          .map((file) => {
            const {
              data: { publicUrl },
            } = supabase.storage
              .from("room-images")
              .getPublicUrl(`${userId}/generated/${file.name}`);

            return {
              name: file.name,
              path: `${userId}/generated/${file.name}`,
              publicUrl,
              lastModified:
                file.created_at || file.updated_at || new Date().toISOString(),
              size: file.metadata?.size || 0,
            };
          });

        console.log(`✅ Found ${imagesWithUrls.length} generated images`);
        setGeneratedImages(imagesWithUrls);

        if (showLoading && imagesWithUrls.length > 0) {
          toast.success(`${imagesWithUrls.length} Bilder geladen`);
        }
      } catch (error) {
        console.error("Failed to fetch generated images:", error);
        if (showLoading) toast.error("Fehler beim Laden der Bilder");
        setGeneratedImages([]);
      } finally {
        if (showLoading) setIsLoadingImages(false);
      }
    },
    [supabase]
  );

  // Refresh images function
  const handleRefreshImages = useCallback(() => {
    if (user?.id) {
      fetchGeneratedImages(user.id, true);
    }
  }, [user?.id, fetchGeneratedImages]);

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

      // Fetch generated images from Supabase storage
      await fetchGeneratedImages(user.id);
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
      className="min-h-screen bg-base-100 antialiased"
    >
      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        {/* Header Section - Simplified for mobile */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="bg-base-100 border border-base-300/50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-lg mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Avatar */}
            <motion.div
              className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-primary/10 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="w-full h-full rounded-xl lg:rounded-2xl object-cover"
                />
              ) : (
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </motion.div>

            {/* User Info - Responsive text sizes */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-base-content tracking-tight truncate">
                {displayName}
              </h1>
              <p className="text-sm sm:text-base text-base-content/60 font-medium truncate">
                {user.email}
              </p>
              <p className="text-xs sm:text-sm text-base-content/50">
                Mitglied seit {joinDate}
              </p>
            </div>

            {/* Credits Display - Compact on mobile */}
            <motion.div
              className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-primary/10 w-full sm:w-auto"
              variants={reducedMotion ? {} : cardVariants}
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 lg:w-5 h-4 lg:h-5 text-warning"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-sm lg:text-base font-semibold text-base-content">
                    Credits
                  </span>
                </div>
                {creditsLoading ? (
                  <div className="w-12 h-6 bg-base-300 rounded animate-pulse mx-auto" />
                ) : (
                  <motion.div
                    className="text-xl lg:text-2xl font-bold text-primary"
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
                    className="px-3 lg:px-4 py-2 bg-primary text-primary-content rounded-lg text-sm font-medium hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Kaufen
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation Tabs - Mobile optimized */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="flex bg-base-200/50 rounded-xl p-1 mb-6 border border-base-300/50"
        >
          {[
            { id: "overview", label: "Übersicht", Icon: UserIcon },
            { id: "history", label: "Historie", Icon: ChartBarIcon },
            { id: "images", label: "Bilder", Icon: PhotoIcon },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                console.log("Tab clicked:", tab.id);
                setActiveTab(tab.id);
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-1 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-content shadow-md"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-300/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <tab.Icon className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">
                {tab.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              variants={reducedMotion ? {} : staggerContainer}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4"
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
                className="bg-base-100 border border-base-300/50 rounded-xl p-4 lg:p-6 shadow-lg"
              >
                <h3 className="text-lg lg:text-xl font-semibold text-base-content mb-4">
                  Statistiken
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60 text-sm">
                      Bilder:
                    </span>
                    <span className="font-semibold text-base-content">
                      {generatedImages.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60 text-sm">
                      Ausgegeben:
                    </span>
                    <span className="font-semibold text-base-content">
                      {transactions
                        .filter((t) => t.type === "deduction")
                        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60 text-sm">
                      Gekauft:
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
                className="bg-base-100 border border-base-300/50 rounded-xl p-4 lg:p-6 shadow-lg"
              >
                <h3 className="text-lg lg:text-xl font-semibold text-base-content mb-4">
                  Aktivitäten
                </h3>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          transaction.type === "purchase"
                            ? "bg-success"
                            : transaction.type === "deduction"
                            ? "bg-error"
                            : transaction.type === "bonus"
                            ? "bg-info"
                            : "bg-base-content/50"
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
                        className={`text-sm font-medium flex-shrink-0 ${
                          transaction.amount > 0 ? "text-success" : "text-error"
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

              {/* Quick Actions - Simplified buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-xl p-4 lg:p-6 shadow-lg"
              >
                <h3 className="text-lg lg:text-xl font-semibold text-base-content mb-4">
                  Aktionen
                </h3>
                <div className="flex flex-col gap-2">
                  <Link href="/">
                    <motion.button
                      variants={reducedMotion ? {} : buttonVariants}
                      whileHover={reducedMotion ? {} : "hover"}
                      whileTap={reducedMotion ? {} : "tap"}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                      <span className="text-sm">Bild hochladen</span>
                    </motion.button>
                  </Link>
                  <Link href="/inspiration">
                    <motion.button
                      variants={reducedMotion ? {} : buttonVariants}
                      whileHover={reducedMotion ? {} : "hover"}
                      whileTap={reducedMotion ? {} : "tap"}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-base-200 text-base-content rounded-lg font-medium hover:bg-base-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                      <span className="text-sm">Inspiration</span>
                    </motion.button>
                  </Link>
                  <Link href="/settings">
                    <motion.button
                      variants={reducedMotion ? {} : buttonVariants}
                      whileHover={reducedMotion ? {} : "hover"}
                      whileTap={reducedMotion ? {} : "tap"}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-base-200 text-base-content rounded-lg font-medium hover:bg-base-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                      <span className="text-sm">Einstellungen</span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              variants={reducedMotion ? {} : cardVariants}
              className="bg-base-100 border border-base-300/50 rounded-xl p-4 lg:p-6 shadow-lg"
            >
              <h3 className="text-xl lg:text-2xl font-semibold text-base-content mb-6">
                Transaktionshistorie
              </h3>

              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 lg:p-4 bg-base-200/50 rounded-lg border border-base-300/30"
                      whileHover={{ scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            transaction.type === "purchase"
                              ? "bg-success/10 text-success"
                              : transaction.type === "deduction"
                              ? "bg-error/10 text-error"
                              : transaction.type === "bonus"
                              ? "bg-info/10 text-info"
                              : "bg-base-300/50 text-base-content/60"
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
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-base-content text-sm truncate">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-base-content/60">
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString("de-DE", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-base lg:text-lg font-bold ${
                            transaction.amount > 0
                              ? "text-success"
                              : "text-error"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount}
                        </p>
                        <p className="text-xs text-base-content/60">
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
                  <p className="text-base-content/60 mb-6 text-sm">
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
              className="bg-base-100 border border-base-300/50 rounded-xl p-4 lg:p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-base-content">
                    Generierte Bilder
                  </h3>
                  {!isLoadingImages && generatedImages.length > 0 && (
                    <p className="text-sm text-base-content/60 mt-1">
                      {generatedImages.length}{" "}
                      {generatedImages.length === 1 ? "Bild" : "Bilder"}
                    </p>
                  )}
                </div>
                <motion.button
                  onClick={handleRefreshImages}
                  disabled={isLoadingImages}
                  variants={reducedMotion ? {} : buttonVariants}
                  whileHover={reducedMotion ? {} : "hover"}
                  whileTap={reducedMotion ? {} : "tap"}
                  className="flex items-center gap-2 px-3 py-2 bg-base-200/50 border border-base-300/50 hover:bg-base-200 hover:border-base-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-base-content transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <svg
                    className={`w-4 h-4 ${
                      isLoadingImages ? "animate-spin" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="hidden sm:inline text-sm">
                    {isLoadingImages ? "Lädt..." : "Aktualisieren"}
                  </span>
                </motion.button>
              </div>

              {isLoadingImages ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-base-200/50 rounded-xl overflow-hidden animate-pulse border border-base-300/30"
                    >
                      <div className="aspect-[4/3] bg-base-300/50" />
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-base-300/50 rounded w-3/4" />
                        <div className="h-3 bg-base-300/50 rounded w-1/2" />
                        <div className="h-3 bg-base-300/50 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedImages.map((image, index) => (
                    <motion.div
                      key={`${image.path}-${index}`}
                      className="bg-base-200/50 rounded-xl overflow-hidden group cursor-pointer border border-base-300/30 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      onClick={() => window.open(image.publicUrl, "_blank")}
                    >
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={image.publicUrl}
                          alt="Generiertes Bild"
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-base-content/0 group-hover:bg-base-content/20 transition-colors duration-200 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-base-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-base-content truncate mb-1">
                          {image.name
                            .replace(/^\d+-\w+\./, "")
                            .replace(/\.(jpg|jpeg|png|webp|gif)$/i, "")}
                        </p>
                        <p className="text-xs text-base-content/60">
                          {new Date(image.lastModified).toLocaleDateString(
                            "de-DE",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                        <p className="text-xs text-base-content/50 mt-1">
                          {(image.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  >
                    <svg
                      className="w-10 h-10 text-primary/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </motion.div>
                  <h4 className="text-xl font-semibold text-base-content mb-3">
                    Noch keine Bilder generiert
                  </h4>
                  <p className="text-base-content/60 mb-6 text-sm max-w-md mx-auto">
                    Laden Sie ein Raumbild hoch und lassen Sie unsere KI es mit
                    Ihren Wunschvorstellungen transformieren.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
                    <Link href="/inspiration">
                      <motion.button
                        variants={reducedMotion ? {} : buttonVariants}
                        whileHover={reducedMotion ? {} : "hover"}
                        whileTap={reducedMotion ? {} : "tap"}
                        className="px-6 py-3 bg-base-200 text-base-content rounded-xl font-medium hover:bg-base-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        Inspiration finden
                      </motion.button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Fallback content for debugging */}
          {activeTab !== "overview" &&
            activeTab !== "history" &&
            activeTab !== "images" && (
              <div className="bg-base-100 border border-base-300/50 rounded-xl p-6 text-center shadow-lg">
                <p className="text-base-content">Unknown tab: {activeTab}</p>
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}
