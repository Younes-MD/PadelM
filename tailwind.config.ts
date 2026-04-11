import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
          opacity: {
      "3": "0.03",
      "6": "0.06",
      "7": "0.07",
      "8": "0.08",
      "12": "0.12",
      "15": "0.15",
      "18": "0.18",
},
      colors: {
        brand: {
          50: "#fef7ee", 100: "#fdedd7", 200: "#f9d6ae", 300: "#f5b87a",
          400: "#ef9043", 500: "#eb7520", 600: "#dc5b16", 700: "#b64314",
          800: "#913618", 900: "#752f16", 950: "#3f1509",
        },
        surface: {
          50: "#f8f8f6", 100: "#f0efe9", 200: "#e0ded2", 300: "#ccc8b4",
          400: "#b6ae94", 500: "#a69b7d", 600: "#998b71", 700: "#80735f",
          800: "#695e51", 900: "#564e43", 950: "#2e2922",
        },
        gold: {
          100: "#fef9e7", 200: "#fdefc3", 300: "#fbe08a", 400: "#f9cc4a",
          500: "#f5b800", 600: "#d4a000", 700: "#a67c00", 800: "#7a5c00", 900: "#4d3a00",
        },
        navy: {
          50: "#e8eaf6", 100: "#c5cae9", 200: "#9fa8da", 300: "#7986cb",
          400: "#5c6bc0", 500: "#3949ab", 600: "#303f9f", 700: "#283593",
          800: "#1a237e", 900: "#0d1257",
        },
        court: {
          50: "#e8f5e9", 100: "#c8e6c9", 200: "#a5d6a7", 300: "#81c784",
          400: "#66bb6a", 500: "#4caf50", 600: "#2e7d32", 700: "#1b5e20",
          800: "#0a3d15", 900: "#042208", 950: "#020f05",
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "marquee": "marquee 30s linear infinite",
        "float": "float 5s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;