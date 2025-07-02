"use client";

import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  staggerContainer,
  staggerItem,
  useMotionPreference,
} from "@/utils/animations";
import { HeroContent } from "./components/HeroContent";
import { InteractiveDemo } from "./components/InteractiveDemo";
import { FeatureShowcase } from "./components/FeatureShowcase";

/**
 * WelcomeScreen Component
 *
 * The main landing screen component that showcases the AI interior design app.
 * Implements Apple-inspired design principles with physics-based animations
 * and follows the single responsibility principle by delegating specific
 * UI sections to focused sub-components.
 */
const WelcomeScreen = () => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleGetStarted = (): void => {
    if (user) {
      // Authenticated user - go to upload
      router.push("/upload");
    } else {
      // Unauthenticated user - go to login
      router.push("/auth/login");
    }
  };

  const handleViewInspiration = (): void => {
    router.push("/inspiration");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/50">
      {/* Hero Section */}
      <motion.section
        variants={reducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex items-center relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Hero Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-20">
            {/* Left Side - Hero Content */}
            <motion.div
              variants={reducedMotion ? {} : staggerItem}
              className="relative"
            >
              <HeroContent
                onGetStarted={handleGetStarted}
                onViewInspiration={handleViewInspiration}
                reducedMotion={reducedMotion}
                user={user}
                loading={loading}
              />
            </motion.div>

            {/* Right Side - Interactive Demo */}
            <motion.div
              variants={reducedMotion ? {} : staggerItem}
              className="relative lg:pl-8"
            >
              <InteractiveDemo />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Feature Showcase Section */}
      <FeatureShowcase />
    </div>
  );
};

export default WelcomeScreen;
