import { type ContentType } from "@repo/types";

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
