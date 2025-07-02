import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useMotionPreference } from "@/utils/animations";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
  spacing?: "sm" | "base" | "lg" | "xl";
  background?: "base" | "glass" | "gradient";
  animation?: boolean;
}

const PageLayout = ({
  children,
  className = "",
  maxWidth = "4xl",
  spacing = "base",
  background = "base",
  animation = true,
}: PageLayoutProps) => {
  const reducedMotion = useMotionPreference();

  // Max width classes
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    full: "max-w-full",
  };

  // Spacing classes
  const spacingClasses = {
    sm: "px-3 py-4 sm:px-4 sm:py-6",
    base: "px-4 py-6 sm:px-6 sm:py-8",
    lg: "px-4 py-8 sm:px-6 sm:py-12",
    xl: "px-6 py-12 sm:px-8 sm:py-16",
  };

  // Background classes
  const backgroundClasses = {
    base: "bg-base-200/30 dark:bg-base-100/50",
    glass:
      "bg-base-100/70 dark:bg-base-100/50 backdrop-blur-xl border border-base-300/20",
    gradient:
      "bg-gradient-to-br from-base-200/50 to-base-300/30 dark:from-base-100/30 dark:to-base-200/20",
  };

  // Animation variants
  const pageVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const containerClasses = `
    min-h-screen w-full flex flex-col
    ${backgroundClasses[background]}
    ${className}
  `.trim();

  const contentClasses = `
    w-full ${maxWidthClasses[maxWidth]} mx-auto
    ${spacingClasses[spacing]}
    flex-1 flex flex-col
  `.trim();

  if (animation && !reducedMotion) {
    return (
      <motion.div
        className={containerClasses}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={contentClasses}>{children}</div>
      </motion.div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>{children}</div>
    </div>
  );
};

export default PageLayout;
