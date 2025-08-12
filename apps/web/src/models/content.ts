export interface CategoryContentDTO {
  id: number;
  thumbnail: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface ContentDetailDTO {
  contentId: number;
  thumbnail: string;
  title: string;
  url: string;
  summary: string;
  memo: string;
  tags: string[];
}
