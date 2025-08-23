import { AIModelDTO } from "@/models/custom-sticker";
import { SummarizeContentDTO } from "@/models/topic";
import { BaseResponseDTO } from "@repo/types";

import { clientApi } from ".";

export const getAiModels = async (): Promise<BaseResponseDTO<AIModelDTO[]>> => {
  return clientApi.get("custom-stickers/models");
};

export const summarizeTopicContent = async (props: {
  topicId: string;
  selectedContentIds: number[];
  requirements: string;
  modelAlias: string;
}): Promise<BaseResponseDTO<SummarizeContentDTO>> => {
  return clientApi.post(`custom-stickers/summarize`, props);
};

export const updateCustomStickerPosition = async (props: {
  customStickerId: number;
  posX: number;
  posY: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { customStickerId, ...restProps } = props;
  return clientApi.put(`custom-stickers/${customStickerId}/position`, restProps);
};

export const updateCustomStickerSize = async (props: {
  customStickerId: number;
  width: number;
  height: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { customStickerId, ...restProps } = props;
  return clientApi.put(`custom-stickers/${customStickerId}/resize`, restProps);
};

export const removeCustomSticker = async (
  customStickerId: number
): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`custom-stickers/${customStickerId}`);
};

export const createCustomSticker = async (props: {
  topicId: string;
  title: string;
  content: string;
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.post(`custom-stickers`, props);
};

export const updateCustomSticker = async (props: {
  customStickerId: number;
  topicId: string;
  title: string;
  content: string;
}): Promise<BaseResponseDTO<unknown>> => {
  const { customStickerId, ...restProps } = props;
  return clientApi.put(`custom-stickers/${customStickerId}`, restProps);
};
