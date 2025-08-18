import { z } from "zod";

export const summarizeSchema = z.object({
  modelName: z.string().min(1, "AI 모델을 선택해주세요"),
  alias: z.string().min(1, "AI 모델을 선택해주세요"),
  prompt: z.string().min(1, "요약 프롬프트를 입력해주세요"),
});

export type SummarizeSchemaType = z.infer<typeof summarizeSchema>;
