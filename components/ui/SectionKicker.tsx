"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function SectionKicker({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 inline-flex items-center gap-4 text-sm font-medium uppercase tracking-[0.3em] text-neon-cyan md:mb-8"
    >
      <span className="h-px w-12 bg-gradient-to-l from-neon-cyan to-transparent" />
      {children}
    </motion.div>
  );
}
