import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useMotionPreference, buttonVariants, staggerContainer, staggerItem } from "@/utils/animations";
import { NavStep, findCurrentStepIndex } from "@/utils/navigation";

interface NavigationBarProps {
  currentStep: string;
  steps: NavStep[];
  showProgress?: boolean;
  className?: string;
  onStepClick?: (href: string) => void;
  showBranching?: boolean;
}

const NavigationBar = ({
  currentStep,
  steps,
  showProgress = true,
  className = "",
  onStepClick,
  showBranching = false,
}: NavigationBarProps) => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();

  const currentStepIndex = findCurrentStepIndex(currentStep, steps);
  const isSelectMode = currentStep.includes('select-mode');

  const progressPercentage = steps.length > 1 
    ? (currentStepIndex / (steps.length - 1)) * 100 
    : 0;

  const handleStepClick = (step: NavStep) => {
    if (step.disabled) return;
    
    if (onStepClick) {
      onStepClick(step.href);
    } else {
      router.push(step.href);
    }
  };

  return (
    <motion.nav
      variants={reducedMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      className={`
        bg-base-100/80 dark:bg-base-100/60 backdrop-blur-xl
        border-b border-base-300/30 dark:border-base-300/20
        sticky top-0 z-40
        ${className}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Mobile Navigation */}
        <div className="sm:hidden py-3">
          <motion.div variants={reducedMotion ? {} : staggerItem}>
            {/* Current Step Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HomeIcon className="w-4 h-4 text-base-content/60" />
                <ChevronRightIcon className="w-3 h-3 text-base-content/40" />
                <span className="text-sm font-medium text-base-content truncate">
                  {steps[currentStepIndex]?.label || "Unknown"}
                </span>
              </div>
              
              {showProgress && (
                <div className="text-xs text-base-content/60">
                  {isSelectMode ? (
                    <span className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Wählen</span>
                    </span>
                  ) : (
                    `${currentStepIndex + 1} / ${steps.length}`
                  )}
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            {showProgress && (
              <div className="mt-2">
                <div className="w-full bg-base-300/50 rounded-full h-1.5">
                  <motion.div
                    className="bg-primary h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:block py-4">
          <motion.div 
            variants={reducedMotion ? {} : staggerContainer}
            className="flex items-center justify-between"
          >
            {/* Breadcrumb Navigation */}
            <motion.div 
              variants={reducedMotion ? {} : staggerItem}
              className="flex items-center space-x-1"
            >
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  {/* Step */}
                  <motion.button
                    onClick={() => handleStepClick(step)}
                    disabled={step.disabled}
                    variants={reducedMotion ? {} : buttonVariants}
                    whileHover={step.disabled || reducedMotion ? {} : "hover"}
                    whileTap={step.disabled || reducedMotion ? {} : "tap"}
                    className={`
                      inline-flex items-center space-x-2 px-3 py-2 rounded-lg
                      font-medium text-sm transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      ${index === currentStepIndex
                        ? "text-primary bg-primary/10"
                        : step.disabled
                        ? "text-base-content/40 cursor-not-allowed"
                        : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
                      }
                    `}
                  >
                    {step.icon && (
                      <span className="w-4 h-4">
                        {step.icon}
                      </span>
                    )}
                    <span>{step.label}</span>
                  </motion.button>

                  {/* Separator - show branching icon on select-mode step */}
                  {index < steps.length - 1 && (
                    <>
                      {isSelectMode && index === currentStepIndex && steps.length === 2 ? (
                        <div className="mx-2 flex items-center space-x-1">
                          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-primary font-medium">Wählen</span>
                        </div>
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 text-base-content/30 mx-2" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Progress Indicator */}
            {showProgress && (
              <motion.div 
                variants={reducedMotion ? {} : staggerItem}
                className="flex items-center space-x-3"
              >
                <span className="text-sm text-base-content/60">
                  {isSelectMode ? (
                    "Wählen Sie Ihren Weg"
                  ) : (
                    `Schritt ${currentStepIndex + 1} von ${steps.length}`
                  )}
                </span>
                
                <div className="flex space-x-1">
                  {steps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`
                        w-2 h-2 rounded-full transition-colors duration-300
                        ${index <= currentStepIndex 
                          ? isSelectMode && index === currentStepIndex 
                            ? "bg-primary animate-pulse" 
                            : "bg-primary"
                          : "bg-base-300"
                        }
                      `}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  ))}
                  {/* Show branch indicator when on select-mode */}
                  {isSelectMode && steps.length === 2 && (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-secondary animate-pulse ml-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Progress Bar */}
          {showProgress && (
            <motion.div 
              variants={reducedMotion ? {} : staggerItem}
              className="mt-3"
            >
              <div className="w-full bg-base-300/30 rounded-full h-1">
                <motion.div
                  className="bg-primary h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default NavigationBar;