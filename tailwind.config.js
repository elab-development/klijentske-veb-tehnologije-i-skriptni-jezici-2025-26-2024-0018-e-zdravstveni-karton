/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
        },
        ink: {
          DEFAULT: "#1A2340",
          muted: "#374151",
          soft: "#6B7280",
          faint: "#9CA3AF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          page: "#F8FAFF",
          subtle: "#F9FAFB",
          alt: "#F3F4F6",
          border: "#E5E7EB",
        },
        success: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        warning: {
          50: "#FFF7ED",
          500: "#D97706",
          600: "#C27803",
          700: "#9A3412",
        },
        danger: {
          50: "#FEF2F2",
          500: "#EF4444",
          600: "#F05252",
          700: "#B91C1C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)",
        soft: "0 6px 24px rgba(15, 23, 42, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
