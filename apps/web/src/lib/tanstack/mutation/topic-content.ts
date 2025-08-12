import {
  createContent,
  removeTopicContentById,
  updateContentPosition,
} from "@/services/topic-content";
import { useMutation } from "@tanstack/react-query";

export const useUpdateContentPosition = () => {
  return useMutation({
    mutationFn: updateContentPosition,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useCreateContent = () => {
  return useMutation({
    mutationFn: createContent,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useRemoveTopicContent = () => {
  return useMutation({
    mutationFn: removeTopicContentById,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
