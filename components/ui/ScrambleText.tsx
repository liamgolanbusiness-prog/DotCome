"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#אבגדהוזחטיכלמנסעפצקרשת";

export default function ScrambleText({
  text,
  className,
  delay = 0,
  duration = 1200,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const [out, setOut] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const start = performance.now() + delay;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        setOut(text.replace(/\S/g, () => CHARS[Math.floor(Math.random() * CHARS.length)]));
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const revealed = Math.floor(text.length * progress);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealed || text[i] === " ") s += text[i];
        else s += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setOut(s);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration]);

  return <span className={className}>{out}</span>;
}
