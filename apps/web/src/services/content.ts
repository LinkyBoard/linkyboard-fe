import { CategoryContentDTO } from "@/models/content";
import { BaseResponseDTO } from "@repo/types";

import { clientApi } from ".";

export const getCategoryContentById = async (
  categoryId: string
): Promise<BaseResponseDTO<CategoryContentDTO[]>> => {
  return clientApi.get(`contents/categories/${categoryId}`);
};
