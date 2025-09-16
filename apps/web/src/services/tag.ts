import { BaseResponseDTO, TagDTO } from "@repo/types";

import { clientApi } from ".";

export const getTags = async (): Promise<BaseResponseDTO<TagDTO[]>> => {
  return clientApi.get("tags");
};
