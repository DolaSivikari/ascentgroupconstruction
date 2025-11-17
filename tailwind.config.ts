import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Barlow', 'system-ui', '-apple-system', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
      },
      colors: {
        // Corporate theme colors
        "construction-black": {
          DEFAULT: "hsl(210 100% 20%)",
          light: "hsl(210 100% 30%)",
          dark: "hsl(210 100% 15%)",
        },
        "construction-orange": {
          DEFAULT: "hsl(24 95% 53%)",
          light: "hsl(24 95% 63%)",
          dark: "hsl(24 95% 48%)",
        },
        "construction-gray": {
          DEFAULT: "hsl(200 18% 26%)",
          light: "hsl(200 18% 46%)",
          dark: "hsl(200 18% 20%)",
        },
        cream: {
          DEFAULT: "hsl(45 50% 95%)",
          dark: "hsl(45 30% 90%)",
        },
        charcoal: {
          DEFAULT: "hsl(200 18% 26%)",
          light: "hsl(200 18% 46%)",
        },
        navy: {
          DEFAULT: "hsl(210 100% 20%)",
          light: "hsl(210 100% 30%)",
          dark: "hsl(210 100% 15%)",
        },
        "slate-cool": {
          50: "hsl(210 40% 98%)",
          100: "hsl(210 40% 96%)",
          200: "hsl(214 32% 91%)",
          300: "hsl(213 27% 84%)",
          400: "hsl(215 20% 65%)",
          500: "hsl(215 16% 47%)",
          600: "hsl(215 19% 35%)",
          700: "hsl(215 25% 27%)",
          800: "hsl(217 33% 17%)",
          900: "hsl(222 47% 11%)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "brand-primary": "hsl(var(--brand-primary))",
        "brand-accent": "hsl(var(--brand-accent))",
        ink: "hsl(var(--ink))",
        line: "hsl(var(--line))",
        "bg-soft": "hsl(var(--bg-soft))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "steel-blue": {
          DEFAULT: "hsl(var(--steel-blue))",
          foreground: "hsl(var(--steel-blue-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Sustainability accent colors (use sparingly in eco-related sections only)
        sustainability: {
          light: "hsl(80 25% 70%)",  // Sage green
          DEFAULT: "hsl(80 47% 40%)", // Olive drab
          dark: "hsl(80 43% 27%)",    // Dark olive
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "var(--radius-xs)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px hsl(var(--secondary) / 0.4)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px hsl(var(--secondary) / 0.6)" },
        },
        "zoom-rotate": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "100%": { transform: "scale(1.1) rotate(3deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "scale-out": "scale-out 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        bounce: "bounce 2s ease-in-out infinite",
        rotate: "rotate 20s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "zoom-rotate": "zoom-rotate 0.3s ease-out forwards",
      },
      zIndex: {
        base: "0",
        dropdown: "10",
        sticky: "20",
        fixed: "30",
        overlay: "40",
        navigation: "50",
        "mega-menu": "60",
        modal: "70",
        toast: "80",
        tooltip: "90",
        "skip-link": "100",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
