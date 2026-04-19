"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

export default function RevealText({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const Wrapper = as as ElementType;

  return (
    <Wrapper ref={ref} className={cn("overflow-hidden", className)}>
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "105%", opacity: 0, filter: "blur(6px)" }}
        animate={inView ? { y: "0%", opacity: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </Wrapper>
  );
}
