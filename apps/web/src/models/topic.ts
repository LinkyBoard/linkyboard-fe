import type { TopicNodeProps } from "@/types/topic";

export interface TopicDTO {
  id: number;
  title: string;
  content: string;
}

export interface SummarizeContentDTO {
  id: number;
  title: string;
  draftMd: string;
}

export interface TopicDetailDTO {
  nodes: TopicNodeProps[];
  edges: {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
  }[];
}
