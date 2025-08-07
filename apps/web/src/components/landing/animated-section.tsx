"use client";

import { ReactNode } from "react";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@repo/ui/utils/cn";

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
