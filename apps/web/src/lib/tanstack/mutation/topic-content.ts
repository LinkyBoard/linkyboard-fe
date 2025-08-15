import { TOPIC } from "@/constants/topic";
import {
  createContent,
  removeTopicContentById,
  updateContentPosition,
  updateContentSize,
} from "@/services/topic-content";
import { errorToast, infoToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";

import { invalidateQueries } from "..";

export const useUpdateContentPosition = () => {
  return useMutation({
    mutationFn: updateContentPosition,
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateContentSize = () => {
  return useMutation({
    mutationFn: updateContentSize,
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateContent = (id: string) => {
  return useMutation({
    mutationFn: createContent,
    onSuccess: () => {
      invalidateQueries([TOPIC.GET_TOPIC_BY_ID, id]);
    },
    onError: (error) => {
      const isDuplicate = error.message.includes("409");
      if (isDuplicate) {
        return infoToast("이미 콘텐츠가 존재해요.");
      }
    },
  });
};

export const useRemoveTopicContent = (id: string) => {
  return useMutation({
    mutationFn: removeTopicContentById,
    onSuccess: () => {
      invalidateQueries([TOPIC.GET_TOPIC_BY_ID, id]);
    },
    onError: () => {
      errorToast("토픽에서 콘텐츠를 제거하지 못했어요.");
    },
  });
};
