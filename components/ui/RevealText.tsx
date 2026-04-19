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
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const Wrapper = as as ElementType;

  return (
    <Wrapper ref={ref} className={cn("overflow-hidden", className)}>
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </Wrapper>
  );
}
