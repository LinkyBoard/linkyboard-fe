import { CUSTOM_STICKER } from "@/constants/custom-sticker";
import { getAiModels } from "@/services/custom-sticker";
import { useQuery } from "@tanstack/react-query";

export const useGetAiModels = () => {
  return useQuery({
    queryKey: [CUSTOM_STICKER.GET_AI_MODELS],
    queryFn: getAiModels,
    select: (data) => data.result,
  });
};
