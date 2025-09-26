import type { BaseResponseDTO, TagDTO } from "@linkyboard/types";

import { clientApi } from ".";

export const getTags = async (): Promise<BaseResponseDTO<TagDTO[]>> => {
  return clientApi.get("tags");
};
