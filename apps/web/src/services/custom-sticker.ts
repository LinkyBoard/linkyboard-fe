import type { AIModelDTO } from "@/models/custom-sticker";
import type { SummarizeContentDTO, TopicDTO } from "@/models/topic";
import type { BaseResponseDTO } from "@linkyboard/types";

import { clientApi } from ".";

export const getAiModels = async (): Promise<BaseResponseDTO<AIModelDTO[]>> => {
  return clientApi.get("custom-stickers/models").json();
};

export const summarizeTopicContent = async (props: {
  topicId: string;
  selectedContentIds: number[];
  requirements: string;
  modelAlias: string;
}): Promise<BaseResponseDTO<SummarizeContentDTO>> => {
  return clientApi.post(`custom-stickers/summarize`, { json: props }).json();
};

export const updateCustomStickerPosition = async (props: {
  customStickerId: number;
  posX: number;
  posY: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { customStickerId, ...restProps } = props;
  return clientApi.put(`custom-stickers/${customStickerId}/position`, { json: restProps }).json();
};

export const updateCustomStickerSize = async (props: {
  customStickerId: number;
  width: number;
  height: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { customStickerId, ...restProps } = props;
  return clientApi.put(`custom-stickers/${customStickerId}/resize`, { json: restProps }).json();
};

export const removeCustomSticker = async (
  customStickerId: string
): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`custom-stickers/${customStickerId}`).json();
};

export const createCustomSticker = async (props: {
  topicId: string;
  title: string;
  content: string;
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.post(`custom-stickers`, { json: props }).json();
};

export const updateCustomSticker = async (props: {
  customStickerId: string;
  topicId: string;
  title: string;
  content: string;
}): Promise<BaseResponseDTO<unknown>> => {
  const { customStickerId, ...restProps } = props;
  return clientApi.put(`custom-stickers/${customStickerId}`, { json: restProps }).json();
};

export const getCustomStickerById = async (
  id: string
): Promise<BaseResponseDTO<Omit<TopicDTO, "id">>> => {
  return clientApi.get(`custom-stickers/${id}`).json();
};
