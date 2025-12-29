import type { ContentDetailDTO } from "@/models/content";
import { removeContentById, updateContent } from "@/services/content";
import type { BaseResponseDTO } from "@linkyboard/types";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { HTTPError } from "ky";

export const useRemoveContentById = () => {
  return useMutation({
    mutationFn: removeContentById,
  });
};

export const useUpdateContent = (
  options?: UseMutationOptions<BaseResponseDTO<unknown>, HTTPError, ContentDetailDTO>
) => {
  return useMutation({
    mutationFn: updateContent,
    ...options,
  });
};
