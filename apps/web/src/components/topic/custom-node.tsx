import { useEffect, useRef } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import {
  useUpdateCustomStickerPosition,
  useUpdateCustomStickerSize,
} from "@/lib/tanstack/mutation/custom-sticker";
import { useUpdateTopicPosition, useUpdateTopicSize } from "@/lib/tanstack/mutation/topic";
import {
  useUpdateContentPosition,
  useUpdateContentSize,
} from "@/lib/tanstack/mutation/topic-content";
import type { TopicDTO } from "@/models/topic";
import type { StickerType } from "@/types/topic";
import type { CategoryContentDTO } from "@linkyboard/types";
import { cn } from "@linkyboard/utils";
import type { NodeProps } from "@xyflow/react";
import { Handle, NodeResizer, Position, useConnection } from "@xyflow/react";

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

  const previousPositionRef = useRef<{ posX: number; posY: number } | null>(null);
  const previousSizeRef = useRef<{ width: number; height: number } | null>(null);

  const connection = useConnection();

  // 콘텐츠 위치, 크기 변경 시 호출
  const { mutateAsync: updateContentPosition } = useUpdateContentPosition();
  const { mutateAsync: updateContentSize } = useUpdateContentSize();

  // 토픽 위치, 크기 변경 시 호출
  const { mutateAsync: updateTopicPosition } = useUpdateTopicPosition();
  const { mutateAsync: updateTopicSize } = useUpdateTopicSize();

  // 커스텀 스티커 위치, 크기 변경 시 호출
  const { mutateAsync: updateCustomStickerPosition } = useUpdateCustomStickerPosition();
  const { mutateAsync: updateCustomStickerSize } = useUpdateCustomStickerSize();

  const isTarget = connection.inProgress && connection.fromNode.id !== props.id;
  const isSource = connection.inProgress && connection.fromNode.id === props.id;

  const stickerClass = stickerStyle[nodeData.nodeContent];

  const debouncedProps = useDebounce(props, 300);

  // 위치 변경 시 updateContentPosition 호출
  useEffect(() => {
    const currentPosition = {
      posX: debouncedProps.positionAbsoluteX,
      posY: debouncedProps.positionAbsoluteY,
    };

    // 초기 마운트 시에는 이전 위치를 저장하고 API 호출하지 않음
    if (previousPositionRef.current === null) {
      previousPositionRef.current = currentPosition;
      return;
    }

    // 위치가 실제로 변경되지 않았으면 API 호출하지 않음
    if (
      previousPositionRef.current.posX === currentPosition.posX &&
      previousPositionRef.current.posY === currentPosition.posY
    ) {
      return;
    }

    previousPositionRef.current = currentPosition;

    const body = {
      topicId: props.topicId,
      ...currentPosition,
    };

    const updatePosition = async () => {
      switch (nodeData.nodeContent) {
        case "topic":
          await updateTopicPosition(body);
          break;
        case "content":
          await updateContentPosition({
            ...body,
            contentId: nodeData.item.id,
          });
          break;
        case "custom_sticker":
          await updateCustomStickerPosition({
            ...body,
            customStickerId: nodeData.item.id,
          });
          break;
        default:
          return;
      }
    };

    updatePosition();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedProps.positionAbsoluteX, debouncedProps.positionAbsoluteY]);

  // 크기 변경 시 updateContentSize 호출
  useEffect(() => {
    const currentSize = {
      width: debouncedProps.width ?? 350,
      height: debouncedProps.height ?? 220,
    };

    // 초기 마운트 시에는 이전 크기를 저장하고 API 호출하지 않음
    if (previousSizeRef.current === null) {
      previousSizeRef.current = currentSize;
      return;
    }

    // 크기가 실제로 변경되지 않았으면 API 호출하지 않음
    if (
      previousSizeRef.current.width === currentSize.width &&
      previousSizeRef.current.height === currentSize.height
    ) {
      return;
    }

    previousSizeRef.current = currentSize;

    const body = {
      topicId: props.topicId,
      ...currentSize,
    };

    const updateSize = async () => {
      switch (nodeData.nodeContent) {
        case "topic":
          await updateTopicSize(body);
          break;
        case "content":
          await updateContentSize({
            ...body,
            contentId: nodeData.item.id,
          });
          break;
        case "custom_sticker":
          await updateCustomStickerSize({
            ...body,
            customStickerId: nodeData.item.id,
          });
          break;
        default:
          return;
      }
    };

    updateSize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        lineStyle={{ borderWidth: "10px" }}
        handleStyle={{ borderWidth: "10px" }}
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
