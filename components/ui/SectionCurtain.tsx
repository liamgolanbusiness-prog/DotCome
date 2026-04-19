"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function SectionCurtain({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <div
      ref={ref}
      dir="ltr"
      className="pointer-events-none relative h-40 overflow-hidden md:h-56"
    >
      <motion.div
        style={{ x, opacity }}
        className="flex h-full items-center whitespace-nowrap font-display text-[9rem] font-black leading-none tracking-tighter md:text-[16rem]"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="bg-gradient-to-r from-neon-violet via-neon-cyan to-neon-magenta bg-clip-text px-8 text-transparent opacity-60"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.15)",
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
