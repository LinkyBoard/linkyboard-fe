import { z } from "zod";

export const contentSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  summary: z.string().optional(),
  memo: z.string().optional(),
  tags: z.array(z.string()),
});

export type ContentSchemaType = z.infer<typeof contentSchema>;
