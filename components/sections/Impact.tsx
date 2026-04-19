"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { he } from "@/content/he";
import SectionKicker from "@/components/ui/SectionKicker";
import RevealText from "@/components/ui/RevealText";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, value, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, mv, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function Impact() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.2 });

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.25),transparent_60%)]"
      />
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionKicker>{he.impact.kicker}</SectionKicker>
        <RevealText as="h2" className="max-w-4xl font-display text-3xl font-black leading-[1.05] md:text-5xl">
          {he.impact.title}
        </RevealText>

        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:mt-20 md:grid-cols-4 md:rounded-3xl"
        >
          {he.impact.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 50, scale: 0.88 }}
              animate={gridInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.65,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-ink-950 p-6 md:p-10"
            >
              <div className="font-display text-4xl font-black gradient-text md:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-xs text-muted md:mt-4 md:text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
