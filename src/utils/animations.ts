/**
 * Animation Library - "Sensorische Signatur"
 * Implements the Apple-like animation system with physics-based transitions
 * as outlined in the design philosophy.
 */

import { Variants, Transition } from "framer-motion";

// Physics-based spring configuration
export const springConfig: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const gentleSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

// Apple-inspired easing curves
export const appleEasing = [0.22, 1, 0.36, 1] as const;
export const appleEaseInOut = [0.4, 0, 0.2, 1] as const;

// Page Transitions
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: appleEasing,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: appleEaseInOut,
    },
  },
};

// Staggered Children Animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springConfig,
  },
};

// Card Animation
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...springConfig,
      delay: 0.1,
    },
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
      duration: 0.15,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 20,
      duration: 0.1,
    },
  },
};

// Button Animations
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: smoothSpring,
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 20,
    },
  },
};

// Toggle Switch Animation
export const toggleVariants: Variants = {
  off: { x: 2 },
  on: { x: 22 },
};

// Loading Animation
export const loadingVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: appleEasing,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: appleEaseInOut,
    },
  },
};

// Image Reveal Animation
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: appleEasing,
    },
  },
};

// Drag and Drop Animation
export const dragVariants: Variants = {
  idle: {
    scale: 1,
    transition: gentleSpring,
  },
  dragging: {
    scale: 1.02,
    transition: gentleSpring,
  },
};

// Modal Animations
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: appleEaseInOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: appleEaseInOut,
    },
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: -50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -30,
    transition: {
      duration: 0.2,
      ease: appleEaseInOut,
    },
  },
};

// Utility function for reduced motion
export const getReducedMotionVariants = (variants: Variants): Variants => {
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

  return reducedVariants;
};

// Custom hook for respecting user's motion preferences
export const useMotionPreference = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
