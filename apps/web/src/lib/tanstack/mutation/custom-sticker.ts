import {
  summarizeTopicContent,
  updateCustomStickerPosition,
  updateCustomStickerSize,
} from "@/services/custom-sticker";
import { useMutation } from "@tanstack/react-query";

export const useSummarizeTopicContent = () => {
  return useMutation({
    mutationFn: summarizeTopicContent,
  });
};

export const useUpdateCustomStickerPosition = () => {
  return useMutation({
    mutationFn: updateCustomStickerPosition,
  });
};

export const useUpdateCustomStickerSize = () => {
  return useMutation({
    mutationFn: updateCustomStickerSize,
  });
};
