"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { he } from "@/content/he";
import GlassCard from "@/components/ui/GlassCard";
import SectionKicker from "@/components/ui/SectionKicker";
import RevealText from "@/components/ui/RevealText";

export default function Services() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <section id="services" className="relative py-20 md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.3),transparent_60%)]"
      />
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionKicker>{he.services.kicker}</SectionKicker>
        <RevealText as="h2" className="max-w-4xl font-display text-3xl font-black leading-[1.05] md:text-5xl">
          {he.services.title}
        </RevealText>

        <div ref={gridRef} className="mt-10 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-6">
          {he.services.items.map((item, i) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 70, scale: 0.94 }}
              animate={gridInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.75,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <GlassCard className="group h-full !p-6 md:!p-8">
                <div className="flex items-start justify-between">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={gridInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-5xl font-black text-white/10 transition-colors group-hover:text-white/30 md:text-6xl"
                  >
                    {item.num}
                  </motion.span>
                  <div className="h-10 w-10 rounded-2xl bg-neon-gradient opacity-70 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100 md:h-12 md:w-12" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold md:mt-8 md:text-3xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted md:mt-4 md:text-base">{item.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2 md:mt-8">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-fg/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
