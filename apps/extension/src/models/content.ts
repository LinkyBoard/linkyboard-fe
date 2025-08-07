export interface DetailSaveContentDTO {
  summary: string;
  category: string;
  tags: string[];
}

export interface FinishDetailSaveContentRequest {
  title: string;
  url: string;
  thumbnail: string;
  memo?: string;
  summary?: string;
  category: string;
  tags?: string[];
}
