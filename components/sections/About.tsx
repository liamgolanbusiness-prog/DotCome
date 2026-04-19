"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { he } from "@/content/he";
import SectionKicker from "@/components/ui/SectionKicker";
import RevealText from "@/components/ui/RevealText";

export default function About() {
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.15 });

  return (
    <section id="about" className="relative py-20 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:gap-16 md:grid-cols-[1fr_1.2fr] md:px-6">
        <div>
          <SectionKicker>{he.about.kicker}</SectionKicker>
          <RevealText as="h2" className="font-display text-3xl font-black leading-[1.05] md:text-5xl">
            {he.about.title}
          </RevealText>
          <div className="mt-8 space-y-5 md:mt-10 md:space-y-6">
            {he.about.body.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="text-base leading-relaxed text-muted md:text-lg"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>

        <div ref={valuesRef} className="grid grid-cols-2 gap-3 self-center md:gap-4">
          {he.about.values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 50, scale: 0.88 }}
              animate={valuesInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all hover:border-white/30 md:rounded-3xl md:p-8"
            >
              <div className="mb-4 h-10 w-10 rounded-xl bg-neon-gradient opacity-80 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 md:mb-6 md:h-12 md:w-12" />
              <h3 className="font-display text-lg font-bold md:text-2xl">{v.title}</h3>
              <p className="mt-2 text-xs text-muted md:mt-3 md:text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
