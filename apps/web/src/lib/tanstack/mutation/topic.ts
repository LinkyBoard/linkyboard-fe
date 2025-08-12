import { createTopic, removeTopicById, updateTopicById } from "@/services/topic";
import { useMutation } from "@tanstack/react-query";

export const useCreateTopic = () => {
  return useMutation({
    mutationFn: createTopic,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateTopic = () => {
  return useMutation({
    mutationFn: updateTopicById,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useRemoveTopic = () => {
  return useMutation({
    mutationFn: removeTopicById,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
