import { motion } from "framer-motion";
import { ReactNode } from "react";
import Image from "next/image";
import { useMotionPreference, cardVariants, buttonVariants } from "@/utils/animations";

interface UnifiedCardProps {
  // Content
  title: string;
  description?: string;
  explanation?: string;
  icon?: ReactNode;
  image?: string | null;
  
  // Interaction
  onClick?: () => void;
  onToggle?: () => void;
  
  // State
  selected?: boolean;
  disabled?: boolean;
  isApplied?: boolean;
  isGenerating?: boolean;
  
  // Appearance
  variant?: "primary" | "secondary" | "suggestion" | "style" | "custom";
  size?: "sm" | "base" | "lg";
  
  // Layout
  layout?: "horizontal" | "vertical" | "image-top";
  
  // Animation
  delay?: number;
  
  // Additional props
  badge?: string;
  actions?: ReactNode;
  className?: string;
}

const UnifiedCard = ({
  title,
  description,
  explanation,
  icon,
  image,
  onClick,
  onToggle,
  selected = false,
  disabled = false,
  isApplied = false,
  isGenerating = false,
  variant = "secondary",
  size = "base",
  layout = "horizontal",
  delay = 0,
  badge,
  actions,
  className = "",
}: UnifiedCardProps) => {
  const reducedMotion = useMotionPreference();
  const cardId = `card-${title.toLowerCase().replace(/\s+/g, "-")}`;

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: "p-3 xs:p-4",
      iconSize: "w-8 h-8 xs:w-10 xs:h-10",
      iconWrapper: "w-12 h-12",
      title: "text-sm xs:text-base font-semibold",
      description: "text-xs xs:text-sm",
      borderRadius: "rounded-lg xs:rounded-xl",
    },
    base: {
      padding: "p-4 xs:p-5 sm:p-6",
      iconSize: "w-5 h-5 xs:w-6 xs:h-6",
      iconWrapper: "w-10 h-10 xs:w-12 xs:h-12",
      title: "text-base xs:text-lg sm:text-xl font-semibold",
      description: "text-xs xs:text-sm sm:text-base",
      borderRadius: "rounded-lg xs:rounded-xl sm:rounded-2xl",
    },
    lg: {
      padding: "p-5 xs:p-6 sm:p-8",
      iconSize: "w-6 h-6 xs:w-7 xs:h-7",
      iconWrapper: "w-12 h-12 xs:w-14 xs:h-14",
      title: "text-lg xs:text-xl sm:text-2xl font-semibold",
      description: "text-sm xs:text-base sm:text-lg",
      borderRadius: "rounded-xl xs:rounded-2xl sm:rounded-3xl",
    },
  };

  const config = sizeConfig[size];

  // Variant styles
  const getVariantClasses = () => {
    if (disabled) {
      return "border-base-300 bg-base-100 cursor-not-allowed opacity-60";
    }

    if (selected) {
      return "border-primary bg-primary/10 shadow-lg shadow-primary/20 ring-2 ring-primary/30";
    }

    if (isApplied) {
      return "border-success bg-success/5 shadow-lg shadow-success/10";
    }

    switch (variant) {
      case "primary":
        return "border-primary bg-primary/5 shadow-lg shadow-primary/10 cursor-pointer hover:border-primary hover:bg-primary/10 hover:shadow-xl hover:shadow-primary/20";
      case "suggestion":
        return "border-base-300 bg-base-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 cursor-pointer hover:bg-base-100";
      case "style":
        return "border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer hover:bg-base-50";
      case "custom":
        return "border-accent/30 bg-accent/5 hover:border-accent hover:shadow-lg hover:shadow-accent/10 cursor-pointer hover:bg-accent/10";
      default:
        return "border-base-300 bg-base-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 cursor-pointer hover:bg-base-50";
    }
  };

  // Handle click action
  const handleClick = () => {
    if (disabled || isGenerating) return;
    
    if (onToggle) {
      onToggle();
    } else if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || isGenerating) return;
    
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      variants={reducedMotion ? {} : cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={reducedMotion || disabled || isGenerating ? {} : "hover"}
      whileTap={reducedMotion || disabled || isGenerating ? {} : "tap"}
      transition={{ delay }}
      className={`
        group ${config.borderRadius} border-2 transition-all duration-300 ease-out relative
        ${getVariantClasses()}
        ${className}
      `}
      onClick={handleClick}
      role="button"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={description ? `${cardId}-description` : undefined}
      aria-disabled={disabled}
      aria-pressed={selected}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-content shadow-lg">
            {badge}
          </span>
        </div>
      )}

      {/* Applied indicator */}
      {isApplied && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
        </div>
      )}

      <div className={config.padding}>
        {/* Image Layout */}
        {layout === "image-top" && image && (
          <div className="mb-4 -mx-1 xs:-mx-2 sm:-mx-3">
            <div className="relative aspect-[4/3] rounded-lg xs:rounded-xl overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
          </div>
        )}

        {/* Content Layout */}
        <div className={`
          ${layout === "vertical" ? "flex flex-col items-center text-center space-y-3" : "flex items-start space-x-3 xs:space-x-4"}
        `}>
          {/* Icon */}
          {icon && (
            <motion.div
              variants={reducedMotion ? {} : buttonVariants}
              whileHover={reducedMotion || disabled ? {} : "hover"}
              whileTap={reducedMotion || disabled ? {} : "tap"}
              className={`
                ${config.iconWrapper} ${config.borderRadius} flex items-center justify-center transition-colors duration-200
                ${disabled
                  ? "bg-base-200"
                  : variant === "primary" || selected
                  ? "bg-primary/10 group-hover:bg-primary/20"
                  : isApplied
                  ? "bg-success/10"
                  : "bg-base-200 group-hover:bg-primary/10"
                }
              `}
            >
              <div
                className={`
                  ${config.iconSize}
                  ${disabled
                    ? "text-base-content/40"
                    : variant === "primary" || selected
                    ? "text-primary"
                    : isApplied
                    ? "text-success"
                    : "text-base-content/60 group-hover:text-primary"
                  }
                `}
                aria-hidden="true"
              >
                {icon}
              </div>
            </motion.div>
          )}

          {/* Text Content */}
          <div className={`${layout === "vertical" ? "w-full" : "flex-1 min-w-0"}`}>
            {/* Title */}
            <h3
              id={`${cardId}-title`}
              className={`
                ${config.title} mb-0.5 xs:mb-1
                ${disabled ? "text-base-content/40" : "text-base-content"}
              `}
            >
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p
                id={`${cardId}-description`}
                className={`
                  ${config.description} leading-relaxed
                  ${disabled ? "text-base-content/30" : "text-base-content/60"}
                `}
              >
                {description}
              </p>
            )}

            {/* Explanation (for suggestions) */}
            {explanation && (
              <p className={`${config.description} leading-relaxed mt-2 text-base-content/50 italic`}>
                {explanation}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="mt-4 flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm rounded-inherit flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
};

export default UnifiedCard;