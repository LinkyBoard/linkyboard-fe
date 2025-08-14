import type { QueryKey } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export const invalidateQueries = (queryKey: QueryKey) => {
  queryClient.invalidateQueries({ queryKey });
};

export const invalidateMany = (queryKeys: QueryKey[]) => {
  return Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
};
