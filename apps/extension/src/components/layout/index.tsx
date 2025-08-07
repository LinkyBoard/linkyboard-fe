import { useCheckToken } from "@/hooks/use-check-token";
import { useDetectPath } from "@/hooks/use-detect-path";
import { queryClient } from "@/lib/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";

import { Outlet } from "react-router-dom";

import { Toaster } from "@repo/ui/components/sonner";

function Layout() {
  useDetectPath();
  useCheckToken();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" duration={3000} closeButton />
    </QueryClientProvider>
  );
}

export default Layout;
