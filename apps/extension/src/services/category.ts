import type { CategoryDTO } from "@/models/category";
import type { BaseResponseDTO } from "@linkyboard/types";

import { api } from ".";

export const getCategories = async (): Promise<BaseResponseDTO<CategoryDTO[]>> => {
  return api.get("categories").json();
};
