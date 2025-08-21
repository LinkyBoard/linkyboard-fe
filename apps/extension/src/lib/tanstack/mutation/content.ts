import { successToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";

import {
  detailSaveWebContent,
  detailSaveYoutubeContent,
  finishDetailSaveWebContent,
  finishDetailSaveYoutubeContent,
  quickSaveWebContent,
  quickSaveYoutubeContent,
} from "../../../services/content";

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
