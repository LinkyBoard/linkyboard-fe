import { CategoryDTO } from "@/models/category";
import { BaseResponseDTO } from "@repo/types";

import { api } from ".";

export const getCategories = async (): Promise<BaseResponseDTO<CategoryDTO[]>> => {
  return api.get("categories").json();
};
