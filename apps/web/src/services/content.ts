import { ContentDetailDTO } from "@/models/content";
import { BaseResponseDTO, CategoryContentDTO } from "@repo/types";

import { clientApi } from ".";

export const getCategoryContentById = async (
  categoryId: string
): Promise<BaseResponseDTO<CategoryContentDTO[]>> => {
  return clientApi.get(`contents/categories/${categoryId}`);
};

export const getContentById = async (
  contentId: number
): Promise<BaseResponseDTO<ContentDetailDTO>> => {
  return clientApi.get(`contents/${contentId}`);
};

export const removeContentById = async (contentId: number): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`contents/${contentId}`);
};

export const updateContent = async (props: ContentDetailDTO): Promise<BaseResponseDTO<unknown>> => {
  const { id, ...restProps } = props;
  return clientApi.put(`contents/${id}`, restProps);
};
