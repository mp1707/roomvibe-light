"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  staggerContainer,
  staggerItem,
  useMotionPreference,
} from "@/utils/animations";
import { HeroContent } from "./components/HeroContent";
import { InteractiveDemo } from "./components/InteractiveDemo";

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

  const handleGetStarted = (): void => {
    router.push("/auth/login");
  };

  const handleViewInspiration = (): void => {
    router.push("/inspiration");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <motion.div
        variants={reducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6"
      >
        {/* Hero Section - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 min-h-screen items-center py-8 lg:py-12">
          {/* Left Side - Hero Content */}
          <HeroContent
            onGetStarted={handleGetStarted}
            onViewInspiration={handleViewInspiration}
            reducedMotion={reducedMotion}
          />

          {/* Right Side - Interactive Demo */}
          <motion.div
            variants={reducedMotion ? {} : staggerItem}
            className="relative lg:pl-8"
          >
            <InteractiveDemo />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
