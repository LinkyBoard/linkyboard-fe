export const CONTENT_TYPE = {
  WEB: "WEB",
  YOUTUBE: "YOUTUBE",
  PDF: "PDF",
} as const;

export type ContentType = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];

export interface CategoryContentDTO {
  id: number;
  thumbnail: string;
  title: string;
  summary: string;
  tags: string[];
  type: ContentType;
  url: string;
  memo: string;
  category: string;
}
