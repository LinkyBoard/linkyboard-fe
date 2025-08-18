import { BaseResponseDTO } from "@repo/types";

import { clientApi } from ".";

export const updateContentPosition = async (props: {
  topicId: string;
  contentId: number;
  posX: number;
  posY: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { topicId, ...restProps } = props;
  return clientApi.put(`topic-contents/topics/${topicId}/position`, restProps);
};

export const updateContentSize = async (props: {
  topicId: string;
  contentId: number;
  width: number;
  height: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { topicId, ...restProps } = props;
  return clientApi.put(`topic-contents/topics/${topicId}/resize`, restProps);
};

export const createContent = async (props: {
  topicId: string;
  contentId: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const body = {
    ...props,
    posX: 0,
    posY: 0,
    width: 350,
    height: 220,
  };
  return clientApi.post("topic-contents", body);
};

export const removeTopicContentById = async (props: {
  topicId: string;
  contentIds: number[];
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`topic-contents/topics/${props.topicId}/contents`, {
    json: {
      contentIds: props.contentIds,
    },
  });
};
