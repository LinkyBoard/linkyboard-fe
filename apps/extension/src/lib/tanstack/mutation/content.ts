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
import { infoToast, successToast } from "@linkyboard/components";
import { useMutation } from "@tanstack/react-query";

import type { HTTPError } from "ky";

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
    onError: (error: HTTPError) => {
      if (error.response.status === 401) {
        infoToast("세션이 만료되었어요. 다시 로그인해주세요.");
      }
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
    onError: (error: HTTPError) => {
      if (error.response.status === 401) {
        infoToast("세션이 만료되었어요. 다시 로그인해주세요.");
      }
    },
  });
};

export const useDetailSaveContent = () => {
  return useMutation({
    mutationFn: detailSaveWebContent,
    onError: (error: HTTPError) => {
      if (error.response.status === 401) {
        infoToast("세션이 만료되었어요. 다시 로그인해주세요.");
      }
    },
  });
};

export const useDetailSaveYoutubeContent = () => {
  return useMutation({
    mutationFn: detailSaveYoutubeContent,
    onError: (error: HTTPError) => {
      if (error.response.status === 401) {
        infoToast("세션이 만료되었어요. 다시 로그인해주세요.");
      }
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
