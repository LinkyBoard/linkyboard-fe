import { BaseResponseDTO } from "@repo/types";

import { clientApi } from ".";

export const updateContentPosition = async (props: {
  topicContentId: number;
  topicId: number;
  contentId: number;
  posX: number;
  posY: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { topicContentId, ...restProps } = props;
  return clientApi.put(`topic-contents/${topicContentId}/position`, restProps);
};

export const createContent = async (props: {
  topicId: number;
  contentId: number;
  posX: number;
  posY: number;
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.post(`topic-contents`, props);
};

export const removeTopicContentById = async (props: {
  topicId: number;
  contentId: number;
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`topic-contents/topics/${props.topicId}/contents/${props.contentId}`);
};
