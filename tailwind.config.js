/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effef6",
          100: "#d7fbe8",
          200: "#b1f5d1",
          300: "#7cebb2",
          400: "#43d78e",
          500: "#1fbd72",
          600: "#14975b",
          700: "#14784b",
          800: "#155f3e",
          900: "#134e35",
        },
        ocean: {
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#bcdeff",
          300: "#8ec9ff",
          400: "#58aaff",
          500: "#3186fb",
          600: "#1c67f0",
          700: "#1852dd",
          800: "#1a43b3",
          900: "#1b3b8c",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)",
        floating: "0 10px 40px -10px rgba(20, 151, 91, 0.35)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
      animation: {
        blink: "blink 1s step-start infinite",
      },
    },
  },
  plugins: [],
};
