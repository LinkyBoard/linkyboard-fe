import { queryClient } from "@/lib/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";

import { Outlet } from "react-router-dom";

import { Toaster } from "../ui/sonner";

function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" duration={3000} closeButton />
    </QueryClientProvider>
  );
}

export default Layout;
