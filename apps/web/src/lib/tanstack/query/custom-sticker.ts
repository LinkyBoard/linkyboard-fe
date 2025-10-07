import { CUSTOM_STICKER } from "@/constants/custom-sticker";
import { getAiModels, getCustomStickerById } from "@/services/custom-sticker";
import { useQuery } from "@tanstack/react-query";

export const useGetAiModels = () => {
  return useQuery({
    queryKey: [CUSTOM_STICKER.GET_AI_MODELS],
    queryFn: getAiModels,
    select: (data) => data.result,
  });
};

export const useGetCustomStickerById = (id: string | undefined) => {
  return useQuery({
    queryKey: [CUSTOM_STICKER.GET_CUSTOM_STICKER_BY_ID, id],
    queryFn: () => getCustomStickerById(id as string),
    enabled: !!id,
    select: (data) => data.result,
  });
};
