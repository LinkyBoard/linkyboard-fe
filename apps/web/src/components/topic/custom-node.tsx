import { CategoryContentDTO } from "@/models/content";
import type { TopicDTO } from "@/models/topic";
import { cn } from "@repo/ui/utils/cn";
import { Handle, NodeProps, Position, useConnection } from "@xyflow/react";

import ContentSticker from "./content-sticker";
import TopicSticker from "./topic-sticker";

interface NodeData {
  nodeContent: "topic" | "content";
  item: TopicDTO | CategoryContentDTO;
}

const stickerStyle = {
  topic: "from-primary bg-gradient-to-br to-blue-600 text-white",
  content: "bg-card hover:border-primary border-border border",
};

export default function CustomNode(props: NodeProps) {
  const nodeData = props.data as unknown as NodeData;

  const connection = useConnection();

  const isTarget = connection.inProgress && connection.fromNode.id !== props.id;
  const isSource = connection.inProgress && connection.fromNode.id === props.id;

  const stickerClass = stickerStyle[nodeData.nodeContent];

  return (
    <div
      className={cn(
        "group max-w-[450px] min-w-[350px] rounded-2xl p-6 shadow-lg transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl",
        stickerClass,
        isTarget && "border-primary",
        isSource && "border-muted-foreground/50"
      )}
    >
      {/* Source Handles - 연결 시작점 */}
      {!connection.inProgress && (
        <>
          <Handle
            className={cn("customHandle", isSource && "connecting")}
            position={Position.Left}
            type="source"
            id="left"
          />
          <Handle
            className={cn("customHandle", isSource && "connecting")}
            position={Position.Right}
            type="source"
            id="right"
          />
          <Handle
            className={cn("customHandle", isSource && "connecting")}
            position={Position.Top}
            type="source"
            id="top"
          />
          <Handle
            className={cn("customHandle", isSource && "connecting")}
            position={Position.Bottom}
            type="source"
            id="bottom"
          />
        </>
      )}

      {/* Target Handles - 연결 종료점 */}
      {(!connection.inProgress || isTarget) && (
        <>
          <Handle
            className={cn("customHandle", isTarget && "connecting")}
            position={Position.Left}
            type="target"
            id="left-target"
            isConnectableStart={false}
          />
          <Handle
            className={cn("customHandle", isTarget && "connecting")}
            position={Position.Right}
            type="target"
            id="right-target"
            isConnectableStart={false}
          />
          <Handle
            className={cn("customHandle", isTarget && "connecting")}
            position={Position.Top}
            type="target"
            id="top-target"
            isConnectableStart={false}
          />
          <Handle
            className={cn("customHandle", isTarget && "connecting")}
            position={Position.Bottom}
            type="target"
            id="bottom-target"
            isConnectableStart={false}
          />
        </>
      )}

      {nodeData.nodeContent === "topic" ? (
        <TopicSticker item={nodeData.item as TopicDTO} />
      ) : (
        <ContentSticker item={nodeData.item as CategoryContentDTO} />
      )}
    </div>
  );
}
