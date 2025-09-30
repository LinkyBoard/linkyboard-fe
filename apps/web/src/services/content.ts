import type { ContentDetailDTO } from "@/models/content";
import type { BaseResponseDTO, CategoryContentDTO } from "@linkyboard/types";

import { clientApi } from ".";

export const getCategoryContentById = async (
  categoryId: string
): Promise<BaseResponseDTO<CategoryContentDTO[]>> => {
  return clientApi.get(`contents/categories/${categoryId}`).json();
};

export const getContentById = async (
  contentId: number
): Promise<BaseResponseDTO<ContentDetailDTO>> => {
  return clientApi.get(`contents/${contentId}`).json();
};

export const removeContentById = async (contentId: number): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`contents/${contentId}`).json();
};

export const updateContent = async (props: ContentDetailDTO): Promise<BaseResponseDTO<unknown>> => {
  const { id, ...restProps } = props;
  return clientApi.put(`contents/${id}`, { json: restProps }).json();
};
