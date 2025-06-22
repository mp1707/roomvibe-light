/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "spring-bounce":
          "springBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        springBounce: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        // Light theme - Professional and clean
        light: {
          primary: "#007AFF",
          "primary-focus": "#0056CC",
          "primary-content": "#FFFFFF",
          secondary: "#5856D6",
          "secondary-focus": "#4845B8",
          "secondary-content": "#FFFFFF",
          accent: "#FF9500",
          "accent-focus": "#CC7700",
          "accent-content": "#FFFFFF",
          neutral: "#8E8E93",
          "neutral-focus": "#6D6D70",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F2F2F7",
          "base-300": "#E5E5EA",
          "base-content": "#1C1C1E",
          info: "#007AFF",
          success: "#30D158",
          warning: "#FF9F0A",
          error: "#FF3B30",
          // Custom CSS properties for enhanced theming
          "--rounded-box": "16px",
          "--rounded-btn": "12px",
          "--rounded-badge": "8px",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-text-case": "none",
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "8px",
          // Custom Apple-like color variables
          "--glass-bg": "rgba(255, 255, 255, 0.7)",
          "--glass-border": "rgba(255, 255, 255, 0.2)",
          "--shadow-color": "rgba(0, 0, 0, 0.1)",
          "--text-muted": "#8E8E93",
          "--border-color": "#E5E5EA",
        },
      },
      {
        // Dark theme - Professional Apple-like dark theme
        dark: {
          primary: "#0A84FF",
          "primary-focus": "#0051D5",
          "primary-content": "#FFFFFF",
          secondary: "#5E5CE6",
          "secondary-focus": "#4C4ADB",
          "secondary-content": "#FFFFFF",
          accent: "#FF9F0A",
          "accent-focus": "#FF8C00",
          "accent-content": "#000000",
          neutral: "#8E8E93",
          "neutral-focus": "#AEAEB2",
          "neutral-content": "#FFFFFF",
          "base-100": "#1C1C1E",
          "base-200": "#2C2C2E",
          "base-300": "#3A3A3C",
          "base-content": "#FFFFFF",
          info: "#0A84FF",
          success: "#30D158",
          warning: "#FF9F0A",
          error: "#FF453A",
          // Custom CSS properties
          "--rounded-box": "16px",
          "--rounded-btn": "12px",
          "--rounded-badge": "8px",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-text-case": "none",
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "8px",
          // Custom Apple-like dark color variables
          "--glass-bg": "rgba(28, 28, 30, 0.7)",
          "--glass-border": "rgba(255, 255, 255, 0.1)",
          "--shadow-color": "rgba(0, 0, 0, 0.3)",
          "--text-muted": "#8E8E93",
          "--border-color": "#3A3A3C",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
};
