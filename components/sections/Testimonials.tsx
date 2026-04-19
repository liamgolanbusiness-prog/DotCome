"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { he } from "@/content/he";
import SectionKicker from "@/components/ui/SectionKicker";
import RevealText from "@/components/ui/RevealText";

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.2),transparent_60%)]"
      />
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end md:gap-6">
          <div>
            <SectionKicker>{he.testimonials.kicker}</SectionKicker>
            <RevealText as="h2" className="max-w-3xl font-display text-3xl font-black leading-[1.05] md:text-5xl">
              {he.testimonials.title}
            </RevealText>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-fg/90 backdrop-blur md:px-5 md:py-2.5"
          >
            <span className="flex -space-x-1">
              {["#7C3AED", "#22D3EE", "#F0ABFC", "#F472B6"].map((c) => (
                <span key={c} className="h-6 w-6 rounded-full border-2 border-ink-950" style={{ background: c }} />
              ))}
            </span>
            <span className="font-medium">92+ לקוחות מרוצים</span>
          </motion.div>
        </div>

        <div ref={gridRef} className="mt-10 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-6">
          {he.testimonials.items.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 80, scale: 0.93 }}
              animate={gridInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.75,
                delay: i * 0.13,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/40 hover:bg-white/[0.08] hover:shadow-[0_30px_80px_-20px_rgba(139,92,246,0.55)] md:rounded-3xl md:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.25),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div dir="ltr" className="relative font-display text-5xl font-black leading-none gradient-text md:text-7xl">
                "
              </div>
              <p className="relative mt-3 flex-1 text-base leading-relaxed text-fg/90 md:mt-4 md:text-xl">
                {t.quote}
              </p>
              <div className="relative mt-6 flex items-center gap-3 border-t border-white/10 pt-5 md:mt-8 md:gap-4 md:pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-gradient font-display text-base font-black text-ink-950 md:h-12 md:w-12 md:text-lg">
                  {t.author.slice(0, 1)}
                </div>
                <div>
                  <div className="font-display text-sm font-bold md:text-base">{t.author}</div>
                  <div className="text-xs text-muted md:text-sm">{t.role}</div>
                </div>
                <div className="mr-auto flex gap-0.5 text-sm text-neon-cyan">★★★★★</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
