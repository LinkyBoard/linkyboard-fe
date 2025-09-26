import type { TopicDTO } from "@/models/topic";
import type { CategoryContentDTO } from "@linkyboard/types";

export type StickerType = "topic" | "content" | "custom_sticker";

export interface TopicNodeProps {
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
}
