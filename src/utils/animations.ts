/**
 * Animation Library - "Sensorische Signatur"
 * Implements the Apple-like animation system with physics-based transitions
 * as outlined in the design philosophy.
 *
 * PERFORMANCE OPTIMIZED VERSION
 */

import { Variants, Transition } from "framer-motion";

// Physics-based spring configuration - memoized
export const springConfig: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

// Lighter spring config for performance-critical components
export const lightSpringConfig: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

// Apple's signature easing curve
export const appleEasing = [0.22, 1, 0.36, 1] as const;

// Page transition animations - optimized
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: appleEasing },
  },
  exit: { opacity: 0, y: -20 },
};

// Card animations - memoized variants
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: lightSpringConfig,
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: lightSpringConfig,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// Button animations - optimized for frequent use
export const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// Light button variants for performance-critical buttons
export const lightButtonVariants: Variants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

// Drag and Drop Animation - optimized for UploadZone
export const dragVariants: Variants = {
  idle: {
    scale: 1,
    transition: lightSpringConfig,
  },
  dragging: {
    scale: 1.02,
    transition: lightSpringConfig,
  },
};

// Container animations for staggered children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05, // Reduced from 0.1 for better performance
    },
  },
};

// Faster stagger for performance-critical lists
export const fastStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.02,
    },
  },
};

// Individual item animations in staggered lists
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: lightSpringConfig,
  },
};

// Modal animations - optimized
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: appleEasing },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Image Reveal Animation - lighter version
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4, // Reduced from 0.6
      ease: appleEasing,
    },
  },
};

// Slide in from side - optimized
export const slideInVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: lightSpringConfig,
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Fade variants - simplest animation for best performance
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Scale variants - for icons and small elements
export const scaleVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// Utility function for reduced motion - memoized
let reducedMotionCache: boolean | null = null;

export const useMotionPreference = () => {
  if (typeof window === "undefined") return false;

  // Cache the result to avoid repeated DOM queries
  if (reducedMotionCache === null) {
    reducedMotionCache = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  return reducedMotionCache;
};

// Get reduced motion variants - memoized function
const variantCache = new Map<Variants, Variants>();

export const getReducedMotionVariants = (variants: Variants): Variants => {
  // Use cache to avoid recreating variants
  if (variantCache.has(variants)) {
    return variantCache.get(variants)!;
  }

  const reducedVariants: Variants = {};

  Object.keys(variants).forEach((key) => {
    const variant = variants[key];
    if (typeof variant === "object") {
      reducedVariants[key] = {
        ...variant,
        transition: { duration: 0 },
      };
    }
  });

  variantCache.set(variants, reducedVariants);
  return reducedVariants;
};

// Performance optimized animation helper
export const getOptimizedVariants = (
  variants: Variants,
  reducedMotion: boolean
) => {
  return reducedMotion ? getReducedMotionVariants(variants) : variants;
};

// Clear variant cache (call this if needed during development)
export const clearVariantCache = () => {
  variantCache.clear();
  reducedMotionCache = null;
};
