import { CategoryDTO } from "@/models/category";
import { BaseResponseDTO } from "@repo/types";

import { clientApi } from ".";

export const createCategory = async (name: string) => {
  return clientApi.post("categories", { name });
};

export const getCategories = async (): Promise<BaseResponseDTO<CategoryDTO[]>> => {
  return clientApi.get("categories");
};

export const removeCategory = async (id: number) => {
  return clientApi.delete(`categories/${id}`);
};
