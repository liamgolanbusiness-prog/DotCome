"use client";

import { motion } from "framer-motion";
import { he } from "@/content/he";
import SectionKicker from "@/components/ui/SectionKicker";
import RevealText from "@/components/ui/RevealText";

export default function Portfolio() {
  return (
    <section id="work" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionKicker>{he.portfolio.kicker}</SectionKicker>
        <RevealText as="h2" className="max-w-4xl font-display text-3xl font-black leading-[1.05] md:text-5xl">
          {he.portfolio.title}
        </RevealText>

        <div className="mt-10 space-y-0 md:mt-20">
          {he.portfolio.items.map((item, i) => (
            <motion.a
              key={item.name}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className="group relative flex flex-col overflow-hidden border-t border-white/10 py-7 transition-all duration-500 hover:border-white/60 md:flex-row md:items-center md:justify-between md:py-10 md:hover:pr-6"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(ellipse at center, ${item.color}22 0%, transparent 70%)`,
                }}
              />
              <div className="flex items-baseline gap-4 md:gap-6">
                <span className="font-display text-sm text-muted">
                  0{i + 1}
                </span>
                <h3
                  className="font-display text-3xl font-black transition-all duration-500 group-hover:scale-[1.02] md:text-6xl md:group-hover:-translate-x-6 md:group-hover:scale-[1.04]"
                  style={{ textShadow: "0 0 0 transparent" }}
                >
                  {item.name}
                </h3>
              </div>
              <div className="mt-3 flex items-center gap-4 md:mt-0">
                <span className="text-sm text-muted">{item.category}</span>
                <span
                  className="h-2.5 w-2.5 rounded-full transition-transform duration-500 group-hover:scale-150 md:h-3 md:w-3"
                  style={{ background: item.color }}
                />
                <span className="text-sm text-muted">{item.year}</span>
                <span className="text-xl opacity-0 transition-all duration-500 group-hover:opacity-100">←</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
