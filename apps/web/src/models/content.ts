import { type ContentType } from "@/constants/content";

export interface CategoryContentDTO {
  id: number;
  thumbnail: string;
  title: string;
  summary: string;
  tags: string[];
  type: ContentType;
}

export interface ContentDetailDTO {
  id: number;
  thumbnail: string;
  title: string;
  url: string;
  summary: string;
  memo: string;
  tags: string[];
  type: ContentType;
  category: string;
}
