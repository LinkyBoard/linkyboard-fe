import { TopicContentDTO, TopicDTO } from "@/models/topic";
import { BaseResponseDTO, PaginationDTO } from "@repo/types";
import { getParams } from "@repo/ui/utils/params";

import { clientApi } from ".";

export const getTopicById = async (id: string): Promise<BaseResponseDTO<TopicDTO>> => {
  return clientApi.get(`topics/${id}`);
};

export const getTopicContentById = async (
  topicId: string
): Promise<BaseResponseDTO<TopicContentDTO[]>> => {
  return clientApi.get(`topic-contents/topics/${topicId}`);
};

export const updateTopicById = async (props: {
  id: string;
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
