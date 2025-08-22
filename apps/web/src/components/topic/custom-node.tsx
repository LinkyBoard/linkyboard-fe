import type { TopicDTO } from "@/models/topic";
import type { StickerType } from "@/types/topic";
import type { CategoryContentDTO } from "@repo/types";
import { cn } from "@repo/ui/utils/cn";
import { Handle, NodeProps, NodeResizer, Position, useConnection } from "@xyflow/react";

import ContentSticker from "./content-sticker";
import TopicSticker from "./topic-sticker";
import UserSticker from "./user-sticker";

interface CustomNodeProps extends NodeProps {
  topicId: string;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
}

interface NodeData {
  nodeContent: StickerType;
  item: TopicDTO | CategoryContentDTO;
}

const stickerStyle = {
  topic: "from-primary bg-gradient-to-br to-blue-600 text-white",
  content: "bg-card hover:border-primary border-border border",
  custom_sticker: "bg-yellow-50 border-yellow-300 border hover:border-yellow-400",
};

export default function CustomNode(props: CustomNodeProps) {
  const nodeData = props.data as unknown as NodeData;

  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== props.id;
  const isSource = connection.inProgress && connection.fromNode.id === props.id;

  const stickerClass = stickerStyle[nodeData.nodeContent];

  return (
    <div
      className={cn(
        "group relative rounded-2xl p-6 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl",
        stickerClass,
        isTarget && "border-primary",
        isSource && "border-muted-foreground/50",
        props.isSelected && "ring-primary ring-2 ring-offset-2"
      )}
      style={{
        minWidth: "21.875rem",
        minHeight: "13.75rem",
        width: props.width,
        height: props.height,
      }}
    >
      <NodeResizer
        minWidth={350}
        minHeight={220}
        lineClassName="opacity-0"
        handleClassName="opacity-0"
      />

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
      ) : nodeData.nodeContent === "content" ? (
        <ContentSticker
          item={nodeData.item as CategoryContentDTO}
          isSelected={props.isSelected}
          onSelect={props.onSelect}
          height={props.height}
        />
      ) : (
        <UserSticker item={nodeData.item as TopicDTO} topicId={props.topicId} />
      )}
    </div>
  );
}
