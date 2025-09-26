"use client";

import { queryClient } from "@/lib/tanstack";
import { Toaster } from "@linkyboard/components";
import { QueryClientProvider } from "@tanstack/react-query";

interface RootProviderProps {
  children: React.ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" duration={3000} closeButton />
    </QueryClientProvider>
  );
}
