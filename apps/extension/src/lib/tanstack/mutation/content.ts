import { successToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";

import {
  detailSaveContent,
  finishDetailSaveContent,
  quickSaveContent,
} from "../../../services/content";

export const useQuickSaveContent = () => {
  return useMutation({
    mutationFn: quickSaveContent,
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

export const useDetailSaveContent = () => {
  return useMutation({
    mutationFn: detailSaveContent,
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useFinishDetailSaveContent = () => {
  return useMutation({
    mutationFn: finishDetailSaveContent,
    onError: (error) => {
      console.error(error);
    },
  });
};
