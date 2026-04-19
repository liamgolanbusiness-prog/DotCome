"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { he } from "@/content/he";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / link click
  const close = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-4 md:py-6"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-full border border-white/10 px-5 py-3 transition-all duration-500 md:px-6",
            scrolled
              ? "bg-ink-950/70 backdrop-blur-xl"
              : "bg-transparent border-transparent"
          )}
        >
          <a href="#top" dir="ltr" className="flex items-center gap-2 font-display text-xl font-black tracking-tight md:text-2xl">
            <span className="inline-block h-2 w-2 rounded-full bg-neon-gradient" />
            <span>{he.brand.name}</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {he.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-base font-medium text-fg/80 transition-colors duration-300 hover:text-fg"
              >
                {l.label}
                <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-neon-gradient transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-neon-gradient px-4 py-2 text-sm font-semibold text-ink-950 shadow-[0_8px_30px_-8px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-[1.08] hover:shadow-[0_15px_45px_-10px_rgba(139,92,246,0.9)] md:px-6 md:py-2.5 md:text-base"
            >
              {he.nav.cta}
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="תפריט"
              className="relative flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full border border-white/15 bg-white/[0.04] backdrop-blur md:hidden"
            >
              <span className={cn("h-[1.5px] w-5 rounded-full bg-fg transition-all duration-300", open && "translate-y-[6.5px] rotate-45")} />
              <span className={cn("h-[1.5px] w-5 rounded-full bg-fg transition-all duration-300", open && "opacity-0")} />
              <span className={cn("h-[1.5px] w-5 rounded-full bg-fg transition-all duration-300", open && "-translate-y-[6.5px] -rotate-45")} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-40 flex min-h-[100svh] flex-col bg-ink-950/95 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {he.nav.links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between border-b border-white/10 py-5 font-display text-3xl font-black text-fg/90 transition-colors hover:text-neon-cyan"
                >
                  <span>{l.label}</span>
                  <span className="text-neon-cyan">←</span>
                </motion.a>
              ))}
            </nav>

            <motion.a
              href="#contact"
              onClick={close}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mt-10 rounded-full bg-neon-gradient px-8 py-4 text-center text-lg font-bold text-ink-950"
            >
              {he.nav.cta}
            </motion.a>

            <div className="mt-auto pt-10 text-sm text-muted">
              hello@dotcome.co.il
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
