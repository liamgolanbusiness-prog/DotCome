"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import { he } from "@/content/he";
import SectionKicker from "@/components/ui/SectionKicker";
import RevealText from "@/components/ui/RevealText";

export default function Process() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return; // skip on mobile

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const distance = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: distance,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="relative bg-ink-950">

      {/* ── Mobile: vertical stack ── */}
      <div className="block md:hidden px-5 py-20">
        <SectionKicker>{he.process.kicker}</SectionKicker>
        <RevealText as="h2" className="font-display text-3xl font-black">{he.process.title}</RevealText>
        <div className="mt-10 space-y-4">
          {he.process.phases.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 60, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-7 backdrop-blur-xl"
            >
              <div className="bg-neon-gradient bg-clip-text font-display text-[5rem] font-black leading-none text-transparent">
                {p.num}
              </div>
              <div className="mt-4">
                <h3 className="font-display text-2xl font-black">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg/75">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Desktop: horizontal GSAP scroll ── */}
      <div ref={rootRef} className="hidden md:block relative overflow-hidden">
        <div className="relative flex h-[100svh] flex-col justify-center">
          <div className="pointer-events-none absolute inset-x-0 top-[12%] z-20 flex flex-col items-center px-6 text-center">
            <SectionKicker>{he.process.kicker}</SectionKicker>
            <h2 className="max-w-3xl font-display text-3xl font-black md:text-5xl">
              {he.process.title}
            </h2>
          </div>

          <div ref={trackRef} className="flex gap-8 px-[10vw] pt-8 will-change-transform">
            {he.process.phases.map((p) => (
              <div
                key={p.num}
                className="relative flex h-[58vh] w-[78vw] shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-10 backdrop-blur-xl md:w-[52vw] md:p-12"
              >
                <div className="bg-neon-gradient bg-clip-text font-display text-[10rem] font-black leading-none text-transparent md:text-[12rem]">
                  {p.num}
                </div>
                <div>
                  <h3 className="font-display text-4xl font-black md:text-5xl">{p.name}</h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-fg/80 md:text-lg">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
