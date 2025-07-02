import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useMotionPreference, staggerContainer, staggerItem } from "@/utils/animations";

interface ContentSectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  spacing?: "none" | "sm" | "base" | "lg" | "xl";
  background?: "none" | "glass" | "subtle";
  animation?: boolean;
  layout?: "stack" | "grid-2" | "grid-3" | "grid-4" | "flex";
  gap?: "sm" | "base" | "lg";
  maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl";
}

const ContentSection = ({
  children,
  title,
  subtitle,
  className = "",
  spacing = "base",
  background = "none",
  animation = true,
  layout = "stack",
  gap = "base",
  maxWidth = "4xl",
}: ContentSectionProps) => {
  const reducedMotion = useMotionPreference();

  // Spacing configurations
  const spacingClasses = {
    none: "",
    sm: "py-4 sm:py-6",
    base: "py-6 sm:py-8",
    lg: "py-8 sm:py-12",
    xl: "py-12 sm:py-16",
  };

  // Background configurations
  const backgroundClasses = {
    none: "",
    glass: "bg-base-100/70 dark:bg-base-100/50 backdrop-blur-xl border border-base-300/20 rounded-2xl p-6 sm:p-8",
    subtle: "bg-base-200/30 dark:bg-base-300/10 rounded-2xl p-6 sm:p-8",
  };

  // Layout configurations
  const layoutClasses = {
    stack: "flex flex-col",
    "grid-2": "grid grid-cols-1 sm:grid-cols-2",
    "grid-3": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "grid-4": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    flex: "flex flex-col sm:flex-row",
  };

  // Gap configurations
  const gapClasses = {
    sm: layout.startsWith("grid") ? "gap-3 sm:gap-4" : "space-y-3 sm:space-y-4",
    base: layout.startsWith("grid") ? "gap-4 sm:gap-6" : "space-y-4 sm:space-y-6",
    lg: layout.startsWith("grid") ? "gap-6 sm:gap-8" : "space-y-6 sm:space-y-8",
  };

  // Max width configurations
  const maxWidthClasses = {
    none: "",
    sm: "max-w-sm mx-auto",
    md: "max-w-md mx-auto",
    lg: "max-w-lg mx-auto",
    xl: "max-w-xl mx-auto",
    "2xl": "max-w-2xl mx-auto",
    "4xl": "max-w-4xl mx-auto",
    "6xl": "max-w-6xl mx-auto",
  };

  const sectionClasses = `
    ${spacingClasses[spacing]}
    ${backgroundClasses[background]}
    ${maxWidthClasses[maxWidth]}
    ${className}
  `.trim();

  const contentClasses = `
    ${layoutClasses[layout]}
    ${gapClasses[gap]}
  `.trim();

  const MotionWrapper = animation && !reducedMotion ? motion.div : "div";
  const animationProps = animation && !reducedMotion ? {
    variants: staggerContainer,
    initial: "hidden",
    animate: "visible",
  } : {};

  return (
    <MotionWrapper
      className={sectionClasses}
      {...animationProps}
    >
      {/* Section Header */}
      {(title || subtitle) && (
        <motion.div
          variants={reducedMotion || !animation ? {} : staggerItem}
          className="text-center mb-6 sm:mb-8"
        >
          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-2 sm:mb-3 antialiased">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto antialiased leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        variants={reducedMotion || !animation ? {} : staggerContainer}
        className={contentClasses}
      >
        {animation && !reducedMotion ? (
          Array.isArray(children) ? (
            children.map((child, index) => (
              <motion.div key={index} variants={staggerItem}>
                {child}
              </motion.div>
            ))
          ) : (
            <motion.div variants={staggerItem}>
              {children}
            </motion.div>
          )
        ) : (
          children
        )}
      </motion.div>
    </MotionWrapper>
  );
};

export default ContentSection;