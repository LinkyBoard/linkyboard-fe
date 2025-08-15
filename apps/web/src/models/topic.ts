import { StickerType } from "@/types/topic";

import { CategoryContentDTO } from "./content";

export interface TopicDTO {
  id: number;
  title: string;
  content: string;
}

export interface TopicDetailDTO {
  nodes: {
    data: {
      item: TopicDTO | CategoryContentDTO;
      nodeContent: StickerType;
    };
    id: string;
    measured: {
      height: number;
      width: number;
    };
    position: {
      x: number;
      y: number;
    };
    type: "custom";
  }[];
  edges: {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
  }[];
}
