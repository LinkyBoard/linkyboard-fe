import type { ContentTypeOptions } from "@/constants/content";
import type { TopicDetailDTO, TopicDTO } from "@/models/topic";
import type { BaseResponseDTO, CategoryContentDTO, PaginationDTO } from "@linkyboard/types";
import { getParams } from "@linkyboard/utils";

import { clientApi } from ".";

export const getTopicBoardById = async (id: string): Promise<BaseResponseDTO<TopicDetailDTO>> => {
  return clientApi.get(`topics/${id}/board`).json();
};

export const updateTopicById = async (props: {
  id: string;
  title: string;
  content: string;
}): Promise<BaseResponseDTO<unknown>> => {
  const { id, ...restProps } = props;
  return clientApi.put(`topics/${id}`, { json: restProps }).json();
};

export const removeTopicById = async (id: string): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`topics/${id}`).json();
};

export const getAllTopics = async (page: number): Promise<PaginationDTO<TopicDTO[]>> => {
  const params = getParams({ page }, { size: 10 });
  return clientApi.get(`topics?${params}`).json();
};

export const createTopic = async (props: {
  title: string;
  content: string;
}): Promise<BaseResponseDTO<number>> => {
  return clientApi.post("topics", { json: props }).json();
};

export const getAllContents = async (props: {
  page: number;
  type: ContentTypeOptions;
}): Promise<PaginationDTO<CategoryContentDTO[]>> => {
  const { page, type } = props;
  const params = getParams({ page, type: type.toLowerCase() }, { size: 10 });
  return clientApi.get(`contents?${params}`).json();
};

export const updateTopicPosition = async (props: {
  topicId: string;
  posX: number;
  posY: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { topicId, ...restProps } = props;
  return clientApi.put(`topics/${topicId}/position`, { json: restProps }).json();
};

export const updateTopicSize = async (props: {
  topicId: string;
  width: number;
  height: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { topicId, ...restProps } = props;
  return clientApi.put(`topics/${topicId}/resize`, { json: restProps }).json();
};

export const getTopicById = async (id: string): Promise<BaseResponseDTO<TopicDTO>> => {
  return clientApi.get(`topics/${id}`).json();
};
