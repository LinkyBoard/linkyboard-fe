import { useDetectPath } from "@/hooks/use-detect-path";
import { queryClient } from "@/lib/tanstack";
import { Toaster } from "@linkyboard/components";
import { QueryClientProvider } from "@tanstack/react-query";

import { Outlet } from "react-router-dom";

import CheckToken from "./check-token";

function Layout() {
  useDetectPath();

  return (
    <QueryClientProvider client={queryClient}>
      <CheckToken />
      <Outlet />
      <Toaster position="top-center" duration={3000} closeButton />
    </QueryClientProvider>
  );
}

export default Layout;
