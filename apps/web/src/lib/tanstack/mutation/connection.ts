import { createConnection, removeConnection } from "@/services/connection";
import { useMutation } from "@tanstack/react-query";

export const useCreateConnection = () => {
  return useMutation({
    mutationFn: createConnection,
  });
};

export const useRemoveConnection = () => {
  return useMutation({
    mutationFn: removeConnection,
  });
};
