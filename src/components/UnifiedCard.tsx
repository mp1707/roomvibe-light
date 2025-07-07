import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";
import Image from "next/image";
import { useMotionPreference, cardVariants, buttonVariants } from "@/utils/animations";
import { Button } from "@/components/ui";

// Helper Components
const ToggleSwitch = ({ 
  checked, 
  onChange, 
  disabled = false,
  ariaLabel,
  id 
}: { 
  checked: boolean; 
  onChange: () => void; 
  disabled?: boolean;
  ariaLabel?: string;
  id: string;
}) => {
  const reducedMotion = useMotionPreference();
  
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange();
      }}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${checked ? 'bg-primary' : 'bg-base-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <motion.span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 
          transition duration-200 ease-in-out
        `}
        animate={reducedMotion ? {} : { x: checked ? 20 : 2 }}
        transition={reducedMotion ? {} : { type: "spring", stiffness: 700, damping: 30 }}
        style={{ x: checked ? 20 : 2 }}
      />
    </button>
  );
};

// Enhanced interfaces for specialized features
interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

interface ImageProps {
  src: string;
  alt: string;
  overlay?: "gradient" | "solid" | "none";
  aspectRatio?: string;
}

interface ActionButton {
  icon: ReactNode;
  onClick: () => void;
  label: string;
  variant?: "edit" | "delete" | "custom";
}

interface PurchaseProps {
  price: number;
  credits: number;
  savings?: string;
  popular?: boolean;
  onPurchase: () => void;
  isLoading?: boolean;
}

interface UnifiedCardProps {
  // Content
  title: string;
  description?: string;
  explanation?: string;
  icon?: ReactNode;
  image?: string | ImageProps | null;
  
  // Interaction
  onClick?: () => void;
  onToggle?: () => void;
  
  // Enhanced Features
  toggle?: ToggleProps;
  actionButtons?: ActionButton[];
  purchase?: PurchaseProps;
  expandable?: {
    content: ReactNode;
    defaultExpanded?: boolean;
  };
  
  // State
  selected?: boolean;
  disabled?: boolean;
  isApplied?: boolean;
  isGenerating?: boolean;
  
  // Appearance
  variant?: "primary" | "secondary" | "suggestion" | "style" | "custom" | "purchase" | "form";
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
  toggle,
  actionButtons,
  purchase,
  expandable,
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
  
  // State for expandable content
  const [isExpanded, setIsExpanded] = useState(expandable?.defaultExpanded ?? false);

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
      case "purchase":
        return purchase?.popular 
          ? "border-primary bg-primary/5 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
          : "border-base-300 bg-base-100 hover:border-primary/30 hover:shadow-lg cursor-pointer";
      case "form":
        return "border-2 border-dashed border-base-300 bg-base-100 hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
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
      {/* Popular Badge (for purchase cards) */}
      {purchase?.popular && (
        <motion.div
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            delay: 0.1,
          }}
        >
          <span className="bg-primary text-primary-content px-3 py-1 rounded-full text-xs font-semibold">
            Beliebt
          </span>
        </motion.div>
      )}

      {/* Savings Badge (for purchase cards) */}
      {purchase?.savings && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            delay: 0.2,
          }}
        >
          <span className="bg-success text-white px-2 py-1 rounded-lg text-xs font-medium">
            {purchase.savings}
          </span>
        </motion.div>
      )}

      {/* General Badge */}
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
            <div className={`relative rounded-lg xs:rounded-xl overflow-hidden ${
              typeof image === 'object' && image.aspectRatio 
                ? image.aspectRatio 
                : "aspect-[4/3]"
            }`}>
              {/* Image overlay for gradient/solid effects */}
              {typeof image === 'object' && image.overlay && image.overlay !== 'none' && (
                <div className={`absolute inset-0 z-10 ${
                  image.overlay === 'gradient' 
                    ? 'bg-gradient-to-t from-black/50 via-transparent to-transparent'
                    : 'bg-black/20'
                }`} />
              )}
              
              <Image
                src={typeof image === 'string' ? image : image.src}
                alt={typeof image === 'string' ? title : image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              
              {/* Selection indicator for style cards */}
              {variant === 'style' && selected && (
                <div className="absolute inset-0 z-20 bg-primary/20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
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

        {/* Toggle Switch (for suggestions/styles) */}
        {toggle && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-base-content/70">
              {toggle.enabled ? "Aktiviert" : "Deaktiviert"}
            </span>
            <ToggleSwitch
              id={`${cardId}-toggle`}
              checked={toggle.enabled}
              onChange={toggle.onChange}
              disabled={toggle.disabled || disabled || isGenerating}
              ariaLabel={toggle.ariaLabel || `Toggle ${title}`}
            />
          </div>
        )}

        {/* Expandable Content */}
        {expandable && (
          <div className="mt-4">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              rightIcon={
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={reducedMotion ? {} : { rotate: isExpanded ? 180 : 0 }}
                  transition={reducedMotion ? {} : { duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              }
            >
              {isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
            </Button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-base-300 mt-4">
                    {expandable.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Purchase Section */}
        {purchase && (
          <div className="mt-4 space-y-4">
            {/* Price Display */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                </svg>
                <span className="text-3xl font-bold text-base-content">
                  {purchase.credits}
                </span>
                <span className="text-sm text-base-content/60">Credits</span>
              </div>
              <div className="text-2xl font-bold text-base-content mb-1">
                €{purchase.price.toFixed(2)}
              </div>
              <p className="text-sm text-base-content/60">Einmalig</p>
            </div>

            {/* Purchase Button */}
            <Button
              onClick={purchase.onPurchase}
              variant="primary"
              size="base"
              fullWidth
              loading={purchase.isLoading}
              disabled={disabled}
            >
              Credits kaufen
            </Button>

            {/* Features */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-center gap-2 text-sm text-base-content/70">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Sofort verfügbar</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-base-content/70">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Kein Ablaufdatum</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {actionButtons && actionButtons.length > 0 && (
          <div className="mt-4 flex justify-end gap-2">
            {actionButtons.map((action, index) => (
              <Button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                variant={action.variant === "delete" ? "error" : "ghost"}
                size="sm"
                leftIcon={action.icon}
                aria-label={action.label}
              >
                <span className="sr-only">{action.label}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Legacy Actions */}
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
export type { UnifiedCardProps, ToggleProps, ImageProps, ActionButton, PurchaseProps };