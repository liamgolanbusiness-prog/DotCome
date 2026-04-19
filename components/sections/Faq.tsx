"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { he } from "@/content/he";
import SectionKicker from "@/components/ui/SectionKicker";
import RevealText from "@/components/ui/RevealText";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const listInView = useInView(listRef, { once: true, amount: 0.1 });

  return (
    <section className="relative py-20 md:py-32">
      <div className="mx-auto max-w-4xl px-5 md:px-6">
        <SectionKicker>{he.faq.kicker}</SectionKicker>
        <RevealText as="h2" className="font-display text-3xl font-black leading-[1.05] md:text-5xl">
          {he.faq.title}
        </RevealText>

        <div ref={listRef} className="mt-10 divide-y divide-white/10 border-y border-white/10 md:mt-16">
          {he.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={listInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-4 py-6 text-right transition-colors duration-300 hover:text-neon-cyan md:gap-6 md:py-8"
                >
                  <span className="font-display text-lg font-bold leading-snug md:text-2xl">
                    {item.q}
                  </span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-xl transition-all duration-500 md:h-10 md:w-10 ${
                      isOpen ? "rotate-45 border-neon-violet bg-neon-gradient text-ink-950 scale-110" : "group-hover:border-white/50 group-hover:scale-105"
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-base leading-relaxed text-muted md:pb-8 md:text-lg">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
