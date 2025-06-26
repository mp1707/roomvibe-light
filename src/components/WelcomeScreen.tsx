"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  staggerContainer,
  staggerItem,
  cardVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";
import DiffSlider from "./DiffSlider";

// Pure function for process step data
const getProcessSteps = () =>
  [
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      ),
      title: "Foto hochladen",
      description: "Bild deines Raumes aufnehmen",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      ),
      title: "KI analysiert",
      description: "Stil, Farben und Potenzial erkennen",
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      ),
      title: "Transformation",
      description: "Personalisierte Designvorschläge",
      bgColor: "bg-success/10",
      iconColor: "text-success",
    },
  ] as const;

// Pure function for feature indicators
const getFeatureIndicators = () =>
  [
    {
      label: "KI Analyse",
      color: "bg-success",
    },
    {
      label: "Farb-Optimierung",
      color: "bg-primary",
    },
    {
      label: "Möbel-Vorschläge",
      color: "bg-accent",
    },
  ] as const;

// Extracted ProcessStep component
interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

const ProcessStep = ({
  icon,
  title,
  description,
  bgColor,
  iconColor,
}: ProcessStepProps) => (
  <div className="flex items-center space-x-4 p-3 rounded-lg bg-base-100/50 border border-base-300/30">
    <div
      className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}
    >
      <svg
        className={`w-5 h-5 ${iconColor}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icon}
      </svg>
    </div>
    <div>
      <h3 className="font-semibold text-base-content">{title}</h3>
      <p className="text-sm text-base-content/60">{description}</p>
    </div>
  </div>
);

// Extracted HeroContent component
interface HeroContentProps {
  onGetStarted: () => void;
  onViewInspiration: () => void;
  reducedMotion: boolean;
}

const HeroContent = ({
  onGetStarted,
  onViewInspiration,
  reducedMotion,
}: HeroContentProps) => (
  <motion.div
    variants={reducedMotion ? {} : staggerItem}
    className="space-y-8 lg:pr-8"
  >
    {/* Main Headline */}
    <div className="space-y-6">
      <motion.h1
        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-base-content leading-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        Verwandle jeden Raum
        <br />
        <span className="text-primary">mit KI-Power.</span>
      </motion.h1>
      <motion.p
        className="text-lg sm:text-xl text-base-content/70 leading-relaxed max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        Lade ein Foto hoch. Erhalte personalisierte Designvorschläge. Verwandle
        dein Zuhause in wenigen Klicks.
      </motion.p>
    </div>

    {/* Process Steps */}
    <motion.div
      variants={reducedMotion ? {} : staggerItem}
      className="space-y-4"
    >
      {getProcessSteps().map((step, index) => (
        <ProcessStep key={index} {...step} />
      ))}
    </motion.div>

    {/* Call to Action */}
    <CallToAction
      onGetStarted={onGetStarted}
      onViewInspiration={onViewInspiration}
      reducedMotion={reducedMotion}
    />
  </motion.div>
);

// Extracted CallToAction component
interface CallToActionProps {
  onGetStarted: () => void;
  onViewInspiration: () => void;
  reducedMotion: boolean;
}

const CallToAction = ({
  onGetStarted,
  onViewInspiration,
  reducedMotion,
}: CallToActionProps) => (
  <motion.div variants={reducedMotion ? {} : staggerItem} className="space-y-4">
    <motion.button
      variants={reducedMotion ? {} : buttonVariants}
      whileHover={reducedMotion ? {} : "hover"}
      whileTap={reducedMotion ? {} : "tap"}
      onClick={onGetStarted}
      className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-focus text-primary-content font-semibold text-lg rounded-2xl transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto justify-center"
    >
      <svg
        className="w-5 h-5 mr-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      Jetzt kostenlos starten
    </motion.button>

    <div className="flex items-center justify-center sm:justify-start">
      <motion.button
        variants={reducedMotion ? {} : buttonVariants}
        whileHover={reducedMotion ? {} : "hover"}
        whileTap={reducedMotion ? {} : "tap"}
        onClick={onViewInspiration}
        className="inline-flex items-center px-4 py-2 text-base-content/70 hover:text-base-content font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Inspiration ansehen
      </motion.button>
    </div>

    <p className="text-xs text-base-content/40 max-w-sm">
      Keine Kreditkarte erforderlich. Starte mit kostenlosen Credits und erlebe
      die Zukunft des Interior Designs.
    </p>
  </motion.div>
);

// Extracted FeatureIndicator component
interface FeatureIndicatorProps {
  label: string;
  color: string;
}

const FeatureIndicator = ({ label, color }: FeatureIndicatorProps) => (
  <div className="flex items-center space-x-2">
    <div className={`w-2 h-2 ${color} rounded-full`} />
    <span className="text-sm text-base-content/70">{label}</span>
  </div>
);

// Extracted FloatingElements component
const FloatingElements = () => (
  <>
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden xl:block"
    >
      <div className="bg-base-100/90 backdrop-blur-sm border border-base-300/30 rounded-2xl p-4 shadow-lg">
        <div className="space-y-2">
          <FeatureIndicator label="KI Analyse" color="bg-success" />
          {getFeatureIndicators()
            .slice(1)
            .map((indicator, index) => (
              <FeatureIndicator key={index} {...indicator} />
            ))}
        </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="absolute -left-4 bottom-8 hidden xl:block"
    >
      <div className="bg-base-100/90 backdrop-blur-sm border border-base-300/30 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-base-content">
            98% Genauigkeit
          </span>
        </div>
      </div>
    </motion.div>
  </>
);

// Extracted InteractiveDemo component
const InteractiveDemo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.6,
      delay: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="relative"
  >
    {/* Feature Badge */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="absolute -top-4 left-4 z-20 bg-primary text-primary-content px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
    >
      ✨ Live Demo
    </motion.div>

    {/* Diff Slider Demo */}
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-base-300/20">
      <DiffSlider
        beforeImageUrl="/assets/images/inspirationBefore.png"
        afterImageUrl="/assets/images/inspirationAfter.png"
        beforeLabel="Vorher"
        afterLabel="Nachher"
        aspectRatio="aspect-[4/3]"
        showInstructionText={true}
        className="shadow-lg"
      />
    </div>

    <FloatingElements />
  </motion.div>
);

// Main WelcomeScreen component - now much cleaner and focused
const WelcomeScreen = () => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  const handleViewInspiration = () => {
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
