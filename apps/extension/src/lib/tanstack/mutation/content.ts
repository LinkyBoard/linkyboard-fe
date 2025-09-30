import { CONTENT } from "@/constants/content";
import {
  detailSaveWebContent,
  detailSaveYoutubeContent,
  finishDetailSaveWebContent,
  finishDetailSaveYoutubeContent,
  quickSaveWebContent,
  quickSaveYoutubeContent,
  updateContent,
} from "@/services/content";
import { successToast } from "@linkyboard/components";
import { useMutation } from "@tanstack/react-query";

import { invalidateQueries } from "..";

export const useQuickSaveContent = () => {
  return useMutation({
    mutationFn: quickSaveWebContent,
    onSuccess: (data) => {
      if (data.isSuccess) {
        successToast("저장에 성공했어요.");
        invalidateQueries([CONTENT.GET_ALL_CONTENTS]);
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
        invalidateQueries([CONTENT.GET_ALL_CONTENTS]);
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

export const useUpdateContent = () => {
  return useMutation({
    mutationFn: updateContent,
    onError: (error) => {
      console.error(error);
    },
  });
};
