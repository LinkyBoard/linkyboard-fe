import { createTopic, removeTopicById, updateTopicById } from "@/services/topic";
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
