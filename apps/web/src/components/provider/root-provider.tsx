"use client";

import { queryClient } from "@/lib/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";

interface RootProviderProps {
  children: React.ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
