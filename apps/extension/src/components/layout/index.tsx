import { queryClient } from "@/lib/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";

import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

export default Layout;
