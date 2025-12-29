import type { QueryKey } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const invalidateQueries = (queryKey: QueryKey) => {
  queryClient.invalidateQueries({ queryKey });
};
