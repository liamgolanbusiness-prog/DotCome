"use client";

import { motion } from "framer-motion";
import { he } from "@/content/he";
import SectionKicker from "@/components/ui/SectionKicker";

export default function About() {
  return (
    <section id="about" className="relative py-20 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:gap-16 md:grid-cols-[1fr_1.2fr] md:px-6">
        <div>
          <SectionKicker>{he.about.kicker}</SectionKicker>
          <h2 className="font-display text-3xl font-black leading-[1.05] md:text-5xl">
            {he.about.title}
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted md:mt-10 md:space-y-6 md:text-lg">
            {he.about.body.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 self-center md:gap-4">
          {he.about.values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
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
