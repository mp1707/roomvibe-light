"use client";

import { motion } from "framer-motion";
import { ReactNode, forwardRef } from "react";
import { buttonVariants, useMotionPreference } from "@/utils/animations";

export interface ButtonProps {
  // Content
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  
  // Behavior
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  
  // Appearance
  variant?: "primary" | "secondary" | "outline" | "ghost" | "error";
  size?: "sm" | "base" | "lg";
  
  // Layout
  fullWidth?: boolean;
  className?: string;
  
  // Accessibility
  "aria-label"?: string;
  "aria-describedby"?: string;
  id?: string;
}

// Standardized sizes following design system
const sizeClasses = {
  sm: "px-4 py-2 text-sm rounded-lg h-9 min-h-0",
  base: "px-6 py-3 text-base rounded-xl h-12 min-h-0",
  lg: "px-8 py-4 text-lg rounded-2xl h-14 min-h-0"
};

// Standardized variants following DaisyUI + design system
const variantClasses = {
  primary: "bg-primary hover:bg-primary-focus text-primary-content border-primary",
  secondary: "bg-base-200 hover:bg-base-300 text-base-content border-base-300",
  outline: "border-2 border-primary text-primary hover:bg-primary/10 bg-transparent",
  ghost: "text-base-content hover:bg-base-200 bg-transparent border-transparent",
  error: "bg-error hover:bg-error-focus text-error-content border-error"
};

// Loading spinner component
const LoadingSpinner = ({ size }: { size: "sm" | "base" | "lg" }) => {
  const spinnerSizes = {
    sm: "w-4 h-4",
    base: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  return (
    <div
      className={`${spinnerSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}
      aria-hidden="true"
    />
  );
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  leftIcon,
  rightIcon,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  variant = "primary",
  size = "base",
  fullWidth = false,
  className = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  id,
  ...rest
}, ref) => {
  const reducedMotion = useMotionPreference();
  
  // Determine if button should be disabled
  const isDisabled = disabled || loading;
  
  // Build class names
  const baseClasses = [
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    sizeClasses[size],
    variantClasses[variant]
  ];
  
  if (fullWidth) {
    baseClasses.push("w-full");
  }
  
  if (isDisabled) {
    baseClasses.push("opacity-60 cursor-not-allowed");
  }
  
  const combinedClassName = [...baseClasses, className].join(" ");

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      className={combinedClassName}
      variants={reducedMotion ? {} : buttonVariants}
      whileHover={reducedMotion || isDisabled ? {} : "hover"}
      whileTap={reducedMotion || isDisabled ? {} : "tap"}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      id={id}
      {...rest}
    >
      {/* Left icon or loading spinner */}
      {loading ? (
        <LoadingSpinner size={size} />
      ) : leftIcon ? (
        <span className="flex-shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      
      {/* Button text */}
      <span className={loading ? "opacity-70" : ""}>
        {children}
      </span>
      
      {/* Right icon (hidden when loading) */}
      {!loading && rightIcon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;