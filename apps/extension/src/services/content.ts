import { BaseResponseDTO } from "@repo/types";

import { DetailSaveContentDTO, FinishDetailSaveContentRequest } from "../models/content";

import { api } from ".";

export const quickSaveContent = async (formData: FormData): Promise<BaseResponseDTO<unknown>> => {
  return api.post("contents", { body: formData }).json();
};

export const detailSaveContent = async ({
  url,
  formData,
}: {
  url: string;
  formData: FormData;
}): Promise<BaseResponseDTO<DetailSaveContentDTO>> => {
  const encodedUrl = encodeURIComponent(url);
  return api.post(`contents/summarize?url=${encodedUrl}`, { body: formData }).json();
};

export const finishDetailSaveContent = async (
  body: FinishDetailSaveContentRequest
): Promise<BaseResponseDTO<string>> => {
  return api.post("contents/summarize/save", { json: body }).json();
};
