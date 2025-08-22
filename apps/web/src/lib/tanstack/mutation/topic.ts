import {
  createTopic,
  removeTopicById,
  updateTopicById,
  updateTopicPosition,
  updateTopicSize,
} from "@/services/topic";
import { useMutation } from "@tanstack/react-query";

export const useCreateTopic = () => {
  return useMutation({
    mutationFn: createTopic,
  });
};

export const useUpdateTopic = () => {
  return useMutation({
    mutationFn: updateTopicById,
  });
};

export const useRemoveTopic = () => {
  return useMutation({
    mutationFn: removeTopicById,
  });
};

export const useUpdateTopicPosition = () => {
  return useMutation({
    mutationFn: updateTopicPosition,
  });
};

export const useUpdateTopicSize = () => {
  return useMutation({
    mutationFn: updateTopicSize,
  });
};
