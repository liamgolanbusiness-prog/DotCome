"use client";

import { he } from "@/content/he";

export default function Manifesto() {
  const loop = [...he.manifesto, ...he.manifesto];
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-ink-900 py-10">
      <div dir="ltr" className="flex gap-16 animate-marquee whitespace-nowrap will-change-transform">
        {loop.map((line, i) => (
          <div key={i} className="flex items-center gap-16">
            <span className="font-display text-3xl font-black uppercase text-fg/90 md:text-7xl">
              {line}
            </span>
            <span className="h-3 w-3 shrink-0 rounded-full bg-neon-gradient" />
          </div>
        ))}
      </div>
    </section>
  );
}
