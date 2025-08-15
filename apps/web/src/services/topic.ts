import type { ContentType } from "@/constants/content";
import type { CategoryContentDTO } from "@/models/content";
import type { TopicDetailDTO, TopicDTO } from "@/models/topic";
import { BaseResponseDTO, PaginationDTO } from "@repo/types";
import { getParams } from "@repo/ui/utils/params";

import { clientApi } from ".";

export const getTopicById = async (id: string): Promise<BaseResponseDTO<TopicDetailDTO>> => {
  return clientApi.get(`topics/${id}`);
};

export const updateTopicById = async (props: {
  id: number;
  title: string;
  content: string;
}): Promise<BaseResponseDTO<unknown>> => {
  const { id, ...restProps } = props;
  return clientApi.put(`topics/${id}`, restProps);
};

export const removeTopicById = async (id: number): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`topics/${id}`);
};

export const getAllTopics = async (page: number): Promise<PaginationDTO<TopicDTO[]>> => {
  const params = getParams({ page }, { size: 10 });
  return clientApi.get(`topics?${params}`);
};

export const createTopic = async (props: {
  title: string;
  content: string;
}): Promise<BaseResponseDTO<number>> => {
  return clientApi.post("topics", props);
};

export const getAllContents = async (props: {
  page: number;
  type: ContentType;
}): Promise<PaginationDTO<CategoryContentDTO[]>> => {
  const { page, type } = props;
  const params = getParams({ page, type: type.toLowerCase() }, { size: 10 });
  return clientApi.get(`contents?${params}`);
};
