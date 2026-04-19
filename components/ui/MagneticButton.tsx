"use client";

import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
  strength?: number;
};

export default function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
  strength = 0.3,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const base =
    "group relative inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold tracking-wide transition-[background,border] duration-300 will-change-transform";

  const styles =
    variant === "primary"
      ? "bg-neon-gradient text-ink-950 shadow-[0_10px_40px_-10px_rgba(124,58,237,0.65)] hover:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.8)]"
      : "border border-white/20 text-fg hover:border-white/60 hover:bg-white/5 backdrop-blur";

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn(base, styles, className)}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/10 text-lg transition-transform duration-500 group-hover:-translate-x-1 group-hover:rotate-[-20deg]"
      >
        ←
      </span>
    </a>
  );
}
