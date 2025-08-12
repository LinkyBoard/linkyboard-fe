import { BaseResponseDTO } from "@repo/types";
import { getParams } from "@repo/ui/utils/params";

import { clientApi, serverApi } from ".";

export const getTopicById = async (id: string): Promise<BaseResponseDTO<unknown>> => {
  return serverApi.get(`topics/${id}`);
};

export const updateTopicById = async (props: {
  id: string;
  title: string;
  content: string;
}): Promise<BaseResponseDTO<unknown>> => {
  const { id, ...restProps } = props;
  return clientApi.put(`topics/${id}`, restProps);
};

export const removeTopicById = async (id: string): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`topics/${id}`);
};

export const getAllTopics = async (page: number): Promise<BaseResponseDTO<unknown>> => {
  const params = getParams({ page }, { size: 10 });
  return clientApi.get(`topics?${params}`);
};

export const createTopic = async (props: {
  title: string;
  content: string;
}): Promise<BaseResponseDTO<number>> => {
  return clientApi.post("topics", props);
};
