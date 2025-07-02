import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useMotionPreference, buttonVariants, staggerItem } from "@/utils/animations";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  onBack?: () => void;
  actions?: ReactNode;
  className?: string;
  align?: "left" | "center";
  size?: "sm" | "base" | "lg" | "xl";
}

const PageHeader = ({
  title,
  subtitle,
  showBackButton = false,
  backHref,
  onBack,
  actions,
  className = "",
  align = "center",
  size = "base",
}: PageHeaderProps) => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();

  // Size configurations
  const sizeConfig = {
    sm: {
      title: "text-xl xs:text-2xl sm:text-3xl",
      subtitle: "text-sm xs:text-base sm:text-lg",
      spacing: "mb-4 sm:mb-6",
    },
    base: {
      title: "text-2xl xs:text-3xl sm:text-4xl md:text-5xl",
      subtitle: "text-base xs:text-lg sm:text-xl",
      spacing: "mb-6 xs:mb-8 md:mb-12",
    },
    lg: {
      title: "text-3xl xs:text-4xl sm:text-5xl md:text-6xl",
      subtitle: "text-lg xs:text-xl sm:text-2xl",
      spacing: "mb-8 xs:mb-12 md:mb-16",
    },
    xl: {
      title: "text-4xl xs:text-5xl sm:text-6xl md:text-7xl",
      subtitle: "text-xl xs:text-2xl sm:text-3xl",
      spacing: "mb-12 xs:mb-16 md:mb-20",
    },
  };

  const config = sizeConfig[size];
  const alignmentClass = align === "center" ? "text-center" : "text-left";

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <motion.div
      variants={reducedMotion ? {} : staggerItem}
      className={`${config.spacing} ${className}`}
    >
      {/* Back Button */}
      {showBackButton && (
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className={`mb-4 sm:mb-6 ${align === "center" ? "flex justify-center" : ""}`}
        >
          <motion.button
            onClick={handleBackClick}
            variants={reducedMotion ? {} : buttonVariants}
            whileHover={reducedMotion ? {} : "hover"}
            whileTap={reducedMotion ? {} : "tap"}
            className="inline-flex items-center gap-2 px-3 xs:px-4 py-2 xs:py-2.5 
                     bg-base-100/80 hover:bg-base-100 
                     border border-base-300/50 hover:border-base-300
                     text-base-content/70 hover:text-base-content
                     rounded-lg xs:rounded-xl 
                     font-medium text-sm xs:text-base
                     backdrop-blur-sm
                     transition-all duration-300 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                     shadow-sm hover:shadow-md"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-4 h-4 xs:w-5 xs:h-5" />
            <span className="hidden xs:inline">Zurück</span>
          </motion.button>
        </motion.div>
      )}

      <div className={alignmentClass}>
        {/* Title */}
        <motion.h1
          variants={reducedMotion ? {} : staggerItem}
          className={`
            ${config.title}
            font-bold tracking-tight text-base-content 
            mb-3 xs:mb-4 md:mb-6
            antialiased
          `}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            variants={reducedMotion ? {} : staggerItem}
            className={`
              ${config.subtitle}
              text-base-content/70 
              ${align === "center" ? "max-w-3xl mx-auto" : "max-w-4xl"}
              antialiased leading-relaxed
            `}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className={`mt-6 sm:mt-8 ${align === "center" ? "flex justify-center" : ""}`}
        >
          {actions}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PageHeader;