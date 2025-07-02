"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const features = [
  {
    icon: "⚡",
    titleKey: "speed.title",
    descriptionKey: "speed.description",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: "🎨",
    titleKey: "quality.title", 
    descriptionKey: "quality.description",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    icon: "🤖",
    titleKey: "intelligence.title",
    descriptionKey: "intelligence.description", 
    gradient: "from-blue-400 to-indigo-500",
  },
];

const benefits = [
  {
    titleKey: "benefits.professional.title",
    descriptionKey: "benefits.professional.description",
    icon: "👔",
  },
  {
    titleKey: "benefits.affordable.title", 
    descriptionKey: "benefits.affordable.description",
    icon: "💰",
  },
  {
    titleKey: "benefits.instant.title",
    descriptionKey: "benefits.instant.description", 
    icon: "⚡",
  },
];

export const FeatureShowcase = () => {
  const t = useTranslations("Components.FeatureShowcase");

  return (
    <div className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-base-100 to-base-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-base-content mb-6">
            {t("title")}
          </h2>
          <p className="text-xl sm:text-2xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2, delayChildren: 0.3 }
            }
          }}
          className="grid md:grid-cols-3 gap-8 mb-24"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 30 }
              }}
              className="relative group"
            >
              <div className="relative h-full p-8 bg-base-100/50 backdrop-blur-sm rounded-3xl border border-base-300/20 shadow-lg overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="text-6xl mb-6 text-center">
                  <motion.span
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {feature.icon}
                  </motion.span>
                </div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold text-base-content mb-4">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-base-content/70 text-lg leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">
            {t("benefits.title")}
          </h3>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {t("benefits.subtitle")}
          </p>
        </motion.div>

        {/* Benefits Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.2 }
            }
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ 
                scale: 1.03,
                transition: { type: "spring", stiffness: 400, damping: 30 }
              }}
              className="p-6 bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-300/20 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h4 className="text-xl font-semibold text-base-content mb-3">
                {t(benefit.titleKey)}
              </h4>
              <p className="text-base-content/70 leading-relaxed">
                {t(benefit.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {t("cta.button")}
          </motion.button>
          <p className="text-base-content/60 mt-4 text-sm">
            {t("cta.subtitle")}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureShowcase;