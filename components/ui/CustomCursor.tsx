"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const addHover = () => ring.current?.classList.add("is-hover");
    const removeHover = () => ring.current?.classList.remove("is-hover");

    window.addEventListener("mousemove", onMove);
    document
      .querySelectorAll("a, button, [data-cursor]")
      .forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-2 w-2 rounded-full bg-neon-cyan mix-blend-difference"
        style={{ transform: "translate3d(-100px,-100px,0)" }}
      />
      <div
        ref={ring}
        className="custom-ring pointer-events-none fixed left-0 top-0 z-[200] h-10 w-10 rounded-full border border-white/60 mix-blend-difference transition-[width,height] duration-300 ease-out"
        style={{ transform: "translate3d(-100px,-100px,0)" }}
      />
      <style jsx global>{`
        .custom-ring.is-hover {
          width: 64px;
          height: 64px;
          border-color: #22d3ee;
        }
      `}</style>
    </>
  );
}
