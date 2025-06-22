/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Apple-inspired custom colors
        "apple-gray": {
          50: "#F5F5F7",
          900: "#1D1D1F",
        },
        "apple-blue": "#007AFF",
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
        aura: {
          primary: "#007AFF",
          "primary-focus": "#0056CC",
          "primary-content": "#FFFFFF",
          secondary: "#5856D6",
          "secondary-focus": "#4845B8",
          "secondary-content": "#FFFFFF",
          accent: "#FF9500",
          "accent-focus": "#CC7700",
          "accent-content": "#FFFFFF",
          neutral: "#6B7280",
          "neutral-focus": "#4B5563",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F9FAFB",
          "base-300": "#F3F4F6",
          "base-content": "#111827",
          info: "#007AFF",
          success: "#34D399",
          warning: "#FBBF24",
          error: "#EF4444",
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
        },
      },
    ],
  },
};
