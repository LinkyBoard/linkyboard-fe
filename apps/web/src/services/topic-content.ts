import type { BaseResponseDTO } from "@linkyboard/types";

import { clientApi } from ".";

export const updateContentPosition = async (props: {
  topicId: string;
  topicContentId: number;
  posX: number;
  posY: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { topicId, ...restProps } = props;
  return clientApi.put(`topic-contents/topics/${topicId}/position`, { json: restProps }).json();
};

export const updateContentSize = async (props: {
  topicId: string;
  topicContentId: number;
  width: number;
  height: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { topicId, ...restProps } = props;
  return clientApi.put(`topic-contents/topics/${topicId}/resize`, { json: restProps }).json();
};

export const createContent = async (props: {
  topicId: string;
  contentId: number;
  posX: number;
  posY: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const body = {
    ...props,
    width: 350,
    height: 220,
  };
  return clientApi.post("topic-contents", { json: body }).json();
};

export const removeTopicContentById = async (props: {
  topicId: string;
  contentIds: number[];
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi
    .delete(`topic-contents/topics/${props.topicId}/contents`, {
      json: {
        topicContentIds: props.contentIds,
      },
    })
    .json();
};
