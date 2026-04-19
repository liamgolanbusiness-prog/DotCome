"use client";

import { he } from "@/content/he";

export default function Manifesto() {
  const loop = [...he.manifesto, ...he.manifesto];
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-ink-900 py-8 md:py-12">
      {/* Row 1 — forward, bright */}
      <div
        dir="ltr"
        className="mb-5 flex gap-10 whitespace-nowrap will-change-transform animate-marquee-fast md:mb-7 md:gap-16"
      >
        {loop.map((line, i) => (
          <div key={i} className="flex shrink-0 items-center gap-10 md:gap-16">
            <span className="font-display text-5xl font-black uppercase text-fg/90 md:text-8xl">
              {line}
            </span>
            <span className="h-3 w-3 shrink-0 rounded-full bg-neon-gradient" />
          </div>
        ))}
      </div>

      {/* Row 2 — reverse, dimmed */}
      <div
        dir="ltr"
        className="flex gap-10 whitespace-nowrap will-change-transform animate-marquee-reverse md:gap-16"
      >
        {loop.map((line, i) => (
          <div key={i} className="flex shrink-0 items-center gap-10 md:gap-16">
            <span className="font-display text-5xl font-black uppercase text-fg/20 md:text-8xl">
              {line}
            </span>
            <span className="h-3 w-3 shrink-0 rounded-full bg-neon-gradient opacity-20" />
          </div>
        ))}
      </div>
    </section>
  );
}
