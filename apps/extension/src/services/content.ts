import type { BaseResponseDTO, CategoryContentDTO, PaginationDTO } from "@linkyboard/types";

import type { DetailSaveContentDTO } from "../models/content";

import { api } from ".";

export const quickSaveWebContent = async (
  formData: FormData
): Promise<BaseResponseDTO<unknown>> => {
  return api.post("contents/web", { body: formData }).json();
};

export const quickSaveYoutubeContent = async (props: {
  title: string;
  url: string;
}): Promise<BaseResponseDTO<unknown>> => {
  const json = {
    ...props,
    thumbnail: "",
    transcript: "",
  };
  return api.post("contents/youtube", { json }).json();
};

export const detailSaveWebContent = async ({
  url,
  formData,
}: {
  url: string;
  formData: FormData;
}): Promise<BaseResponseDTO<DetailSaveContentDTO>> => {
  const encodedUrl = encodeURIComponent(url);
  return api.post(`contents/summarize?url=${encodedUrl}`, { body: formData }).json();
};

export const detailSaveYoutubeContent = async (json: {
  url: string;
}): Promise<BaseResponseDTO<DetailSaveContentDTO>> => {
  return api.post("contents/summarize/youtube", { json }).json();
};

export const finishDetailSaveWebContent = async (
  formData: FormData
): Promise<BaseResponseDTO<string>> => {
  return api.post("contents/summarize/save", { body: formData }).json();
};

export const finishDetailSaveYoutubeContent = async (json: {
  title: string;
  url: string;
  thumbnail: string;
  memo: string;
  summary: string;
  transcript: string;
  category: string;
  tags: string[];
}): Promise<BaseResponseDTO<unknown>> => {
  return api.post("contents/summarize/youtube/save", { json }).json();
};

export const getAllContents = async (): Promise<PaginationDTO<CategoryContentDTO[]>> => {
  return api.get("contents?size=50").json();
};

export const getContentById = async (id: string): Promise<BaseResponseDTO<CategoryContentDTO>> => {
  return api.get(`contents/${id}`).json();
};

export const updateContent = async (props: {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  memo: string;
  summary: string;
  category: string;
  tags: string[];
}): Promise<BaseResponseDTO<unknown>> => {
  const { id, ...restProps } = props;
  return api.put(`contents/${id}`, { json: restProps }).json();
};
