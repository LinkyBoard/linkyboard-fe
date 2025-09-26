"use client";

import { useEffect, useRef } from "react";

import { cn } from "@linkyboard/utils";

import { Loader2 } from "lucide-react";

interface SentinelSpinnerProps {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  className?: string;
}

export default function SentinelSpinner({
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  className,
}: SentinelSpinnerProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  return (
    <>
      {!isLoading && isFetchingNextPage && <Loader2 className={cn("animate-spin", className)} />}
      <div ref={sentinelRef} />
    </>
  );
}
