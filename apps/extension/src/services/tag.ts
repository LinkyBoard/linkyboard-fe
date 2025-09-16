import { BaseResponseDTO, TagDTO } from "@repo/types";

import { api } from ".";

export const getTags = async (): Promise<BaseResponseDTO<TagDTO[]>> => {
  return api.get("tags").json();
};
