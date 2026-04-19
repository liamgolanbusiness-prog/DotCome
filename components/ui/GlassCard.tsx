import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group/card relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] p-6 backdrop-blur-xl md:rounded-3xl md:p-8",
        "transition-all duration-500 ease-out will-change-transform",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/[0.12] before:to-transparent before:opacity-70 before:transition-opacity before:duration-500",
        "after:pointer-events-none after:absolute after:-inset-px after:rounded-3xl after:opacity-0 after:transition-opacity after:duration-500",
        "after:bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.35),transparent_60%)]",
        "hover:-translate-y-2 hover:border-white/40 hover:bg-white/[0.08]",
        "hover:shadow-[0_30px_80px_-20px_rgba(139,92,246,0.55),0_20px_60px_-30px_rgba(34,211,238,0.35)]",
        "hover:after:opacity-100 hover:before:opacity-100",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
