import { z } from "zod";

export const contentSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  url: z.string().min(1, "URL을 입력해주세요."),
  thumbnail: z.string().min(1, "썸네일을 입력해주세요."),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  summary: z.string().optional(),
  memo: z.string().optional(),
  tags: z.array(z.string()),
});

export type ContentSchemaType = z.infer<typeof contentSchema>;
