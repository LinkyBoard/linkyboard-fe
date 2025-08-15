import { BaseResponseDTO } from "@repo/types";

import { clientApi } from ".";

export const updateContentPosition = async (props: {
  topicContentId: number;
  topicId: string;
  contentId: number;
  posX: number;
  posY: number;
  width: number;
  height: number;
}): Promise<BaseResponseDTO<unknown>> => {
  const { topicContentId, ...restProps } = props;
  return clientApi.put(`topic-contents/${topicContentId}/position`, restProps);
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
  contentId: number;
}): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`topic-contents/topics/${props.topicId}/contents/${props.contentId}`);
};
