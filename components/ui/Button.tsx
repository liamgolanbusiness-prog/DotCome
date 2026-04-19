"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
};

export default function Button({
  children,
  href,
  variant = "primary",
  className,
  onClick,
}: Props) {
  const base =
    "group relative inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-all duration-300 will-change-transform";

  const styles =
    variant === "primary"
      ? "bg-neon-gradient text-ink-950 hover:scale-[1.03] shadow-[0_10px_40px_-10px_rgba(124,58,237,0.6)]"
      : "border border-white/15 text-fg hover:border-white/40 hover:bg-white/5 backdrop-blur";

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/10 transition-transform duration-300 group-hover:-translate-x-1"
      >
        ←
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cn(base, styles, className)}>
        {content}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cn(base, styles, className)}>
      {content}
    </button>
  );
}
