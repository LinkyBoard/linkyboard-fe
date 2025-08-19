import {
  createCustomSticker,
  removeCustomSticker,
  summarizeTopicContent,
  updateCustomSticker,
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

export const useRemoveCustomSticker = () => {
  return useMutation({
    mutationFn: removeCustomSticker,
  });
};

export const useCreateCustomSticker = () => {
  return useMutation({
    mutationFn: createCustomSticker,
  });
};

export const useUpdateCustomSticker = () => {
  return useMutation({
    mutationFn: updateCustomSticker,
  });
};
