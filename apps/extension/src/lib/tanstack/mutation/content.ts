import { CONTENT } from "@/constants/content";
import {
  detailSaveWebContent,
  detailSaveYoutubeContent,
  finishDetailSaveWebContent,
  finishDetailSaveYoutubeContent,
  getAllContents,
  quickSaveWebContent,
  quickSaveYoutubeContent,
  updateContent,
} from "@/services/content";
import { successToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";

export const useQuickSaveContent = () => {
  return useMutation({
    mutationFn: quickSaveWebContent,
    onSuccess: (data) => {
      if (data.isSuccess) {
        successToast("저장에 성공했어요.");
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useQuickSaveYoutubeContent = () => {
  return useMutation({
    mutationFn: quickSaveYoutubeContent,
    onSuccess: (data) => {
      if (data.isSuccess) {
        successToast("저장에 성공했어요.");
      }
    },
  });
};

export const useDetailSaveContent = () => {
  return useMutation({
    mutationFn: detailSaveWebContent,
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDetailSaveYoutubeContent = () => {
  return useMutation({
    mutationFn: detailSaveYoutubeContent,
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useFinishDetailSaveContent = () => {
  return useMutation({
    mutationFn: finishDetailSaveWebContent,
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useFinishDetailSaveYoutubeContent = () => {
  return useMutation({
    mutationFn: finishDetailSaveYoutubeContent,
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetAllContents = () => {
  return useMutation({
    mutationKey: [CONTENT.GET_ALL_CONTENTS],
    mutationFn: getAllContents,
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateContent = () => {
  return useMutation({
    mutationFn: updateContent,
    onError: (error) => {
      console.error(error);
    },
  });
};
