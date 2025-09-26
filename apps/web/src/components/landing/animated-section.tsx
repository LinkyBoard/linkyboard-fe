"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@linkyboard/utils";

import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  animationClass?: string;
}

export default function AnimatedSection({
  children,
  animationClass = "animate-fade-in-up",
}: AnimatedSectionProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={elementRef as React.Ref<HTMLDivElement>}
      className={cn(
        "transition-all duration-700",
        isIntersecting ? animationClass : "translate-y-8 opacity-0"
      )}
    >
      {children}
    </div>
  );
}
