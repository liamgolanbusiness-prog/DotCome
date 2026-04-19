"use client";

import { motion } from "framer-motion";
import { he } from "@/content/he";
import MagneticButton from "@/components/ui/MagneticButton";
import ScrambleText from "@/components/ui/ScrambleText";
import { AntiGravityCanvas } from "@/components/ui/particle-effect-for-hero";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <AntiGravityCanvas />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,6,14,0.92)_80%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
      >
        <motion.span
          dir="ltr"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="select-none whitespace-nowrap font-display text-[20vw] font-black tracking-tighter text-white/[0.025]"
        >
          DOTCOME · DOTCOME · DOTCOME
        </motion.span>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 pt-28 pb-14 pointer-events-none md:px-10 md:pt-32 md:pb-16">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-fg/90 backdrop-blur md:gap-3 md:px-4 md:text-xs md:tracking-[0.2em]"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-cyan" />
          <ScrambleText text={he.hero.eyebrow} duration={1400} delay={400} />
        </motion.div>

        {/* Headline */}
        <h1 className="mt-5 font-display font-black leading-[0.88] tracking-[-0.03em] text-[clamp(2.4rem,8.5vw,8.5rem)] md:mt-6">
          {he.hero.title.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 1.0,
                  delay: 0.3 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.66, ease: [0.16, 1, 0.3, 1] }}
              className="block gradient-text"
            >
              {he.hero.highlight}
            </motion.span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.95, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-fg/75 md:mt-8 md:text-xl"
        >
          {he.hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap gap-3 pointer-events-auto md:mt-10 md:gap-4"
        >
          <MagneticButton href="#contact">{he.hero.ctaPrimary}</MagneticButton>
          <MagneticButton href="#work" variant="ghost">
            {he.hero.ctaSecondary}
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-fg/30">גללו</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-[1px] bg-gradient-to-b from-fg/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
