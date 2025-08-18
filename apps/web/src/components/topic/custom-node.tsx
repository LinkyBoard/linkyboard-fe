import { useEffect } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { useUpdateTopicPosition, useUpdateTopicSize } from "@/lib/tanstack/mutation/topic";
import {
  useUpdateContentPosition,
  useUpdateContentSize,
} from "@/lib/tanstack/mutation/topic-content";
import { CategoryContentDTO } from "@/models/content";
import type { TopicDTO } from "@/models/topic";
import { cn } from "@repo/ui/utils/cn";
import { Handle, NodeProps, NodeResizer, Position, useConnection } from "@xyflow/react";

import ContentSticker from "./content-sticker";
import TopicSticker from "./topic-sticker";

interface CustomNodeProps extends NodeProps {
  topicId: string;
  isSelected: boolean;
  onSelect: (nodeId: number) => void;
}

interface NodeData {
  nodeContent: "topic" | "content";
  item: TopicDTO | CategoryContentDTO;
}

const stickerStyle = {
  topic: "from-primary bg-gradient-to-br to-blue-600 text-white",
  content: "bg-card hover:border-primary border-border border",
};

export default function CustomNode(props: CustomNodeProps) {
  const nodeData = props.data as unknown as NodeData;

  const connection = useConnection();

  // 콘텐츠 위치, 크기 변경 시 호출
  const { mutateAsync: updateContentPosition } = useUpdateContentPosition();
  const { mutateAsync: updateContentSize } = useUpdateContentSize();

  // 토픽 위치, 크기 변경 시 호출
  const { mutateAsync: updateTopicPosition } = useUpdateTopicPosition();
  const { mutateAsync: updateTopicSize } = useUpdateTopicSize();

  const isTarget = connection.inProgress && connection.fromNode.id !== props.id;
  const isSource = connection.inProgress && connection.fromNode.id === props.id;
  const isTopic = nodeData.nodeContent === "topic";

  const stickerClass = stickerStyle[nodeData.nodeContent];

  const debouncedProps = useDebounce(props, 300);

  // 위치 변경 시 updateContentPosition 호출
  useEffect(() => {
    const body = {
      topicId: props.topicId,
      posX: debouncedProps.positionAbsoluteX,
      posY: debouncedProps.positionAbsoluteY,
    };
    const updatePosition = async () => {
      if (isTopic) {
        await updateTopicPosition(body);
      } else {
        await updateContentPosition({
          ...body,
          contentId: nodeData.item.id,
        });
      }
    };
    updatePosition();
  }, [debouncedProps.positionAbsoluteX, debouncedProps.positionAbsoluteY]);

  // 크기 변경 시 updateContentSize 호출
  useEffect(() => {
    const body = {
      topicId: props.topicId,
      width: debouncedProps.width ?? 350,
      height: debouncedProps.height ?? 220,
    };
    const updateSize = async () => {
      if (isTopic) {
        await updateTopicSize(body);
      } else {
        await updateContentSize({
          ...body,
          contentId: nodeData.item.id,
        });
      }
    };
    updateSize();
  }, [debouncedProps.width, debouncedProps.height]);

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

      {isTopic ? (
        <TopicSticker item={nodeData.item as TopicDTO} />
      ) : (
        <ContentSticker
          item={nodeData.item as CategoryContentDTO}
          isSelected={props.isSelected}
          onSelect={props.onSelect}
        />
      )}
    </div>
  );
}
