import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0B1F",
          900: "#12142E",
          800: "#1A1D3E",
          700: "#242852",
        },
        neon: {
          violet: "#7C3AED",
          cyan: "#22D3EE",
          magenta: "#F0ABFC",
        },
        fg: "#F8FAFC",
        muted: "#94A3B8",
      },
      fontFamily: {
        sans: ["var(--font-heebo)", "system-ui", "sans-serif"],
        display: ["var(--font-rubik)", "system-ui", "sans-serif"],
      },
      fontSize: {
        mega: ["clamp(3rem, 10vw, 9rem)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        giga: ["clamp(5rem, 18vw, 22rem)", { lineHeight: "0.85", letterSpacing: "-0.05em" }],
      },
      backgroundImage: {
        "neon-gradient":
          "linear-gradient(135deg, #7C3AED 0%, #22D3EE 50%, #F0ABFC 100%)",
        "radial-glow":
          "radial-gradient(ellipse at center, rgba(124,58,237,0.35) 0%, rgba(34,211,238,0.15) 35%, transparent 70%)",
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      },
      animation: {
        "gradient-shift": "gradient-shift 12s ease infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "marquee-fast": "marquee 16s linear infinite",
        "marquee-reverse": "marquee 22s linear infinite reverse",
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%, -40%) scale(1)" },
        },
        "gradient-shift": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
