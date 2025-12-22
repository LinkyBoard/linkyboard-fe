"use client";

import { useMemo } from "react";

import { useCreateContent } from "@/lib/tanstack/mutation/topic-content";
import { Spinner } from "@linkyboard/components";
import type { CategoryContentDTO } from "@linkyboard/types";
import type { Connection, Edge, Node, NodeProps, NodeTypes } from "@xyflow/react";
import {
  Background,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";

import { AlertTriangle } from "lucide-react";

import ContextMenuProvider from "./context-menu-provider";
import Sticker from "./sticker";

interface ReactFlowCanvasProps {
  isLoading: boolean;
  isTopicError: boolean;
  isNotFoundError: boolean;
  id: string;
  nodes: Node[];
  edges: Edge[];
  selectedNodeIds: string[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: (params: Connection) => void;
  onEdgeClick: (e: React.MouseEvent, edge: Edge) => void;
  onNodeSelect: (nodeId: string) => void;
}

const connectionLineStyle = {
  stroke: "#b1b1b7",
  strokeWidth: 3,
};

const defaultEdgeOptions = {
  style: {
    strokeWidth: 3,
  },
};

export default function ReactFlowCanvas(props: ReactFlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
}

function FlowCanvas({
  isLoading,
  isTopicError,
  isNotFoundError,
  id,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgeClick,
  selectedNodeIds,
  onNodeSelect,
}: ReactFlowCanvasProps) {
  const { screenToFlowPosition } = useReactFlow();
  const { mutateAsync: createContent } = useCreateContent(id);

  const isTriggerDisabled = selectedNodeIds.length === 0;

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      custom: (props: NodeProps) => (
        <Sticker
          {...props}
          key={`topic-nodes-${id}`}
          topicId={id}
          isSelected={selectedNodeIds.includes(props.id)}
          onSelect={onNodeSelect}
        />
      ),
    }),
    [selectedNodeIds, id, onNodeSelect]
  );

  // 드래그 앤 드롭 핸들러
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();

    const contentData: CategoryContentDTO = JSON.parse(e.dataTransfer.getData("application/json"));

    // ReactFlow 좌표계로 변환
    const flowPosition = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    await createContent({
      topicId: id,
      contentId: contentData.id,
      posX: flowPosition.x,
      posY: flowPosition.y,
    });
  };

  return (
    <ContextMenuProvider isTriggerDisabled={isTriggerDisabled}>
      <div
        className="relative flex-1 overflow-hidden rounded-r-lg border border-l-0"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner className="text-muted-foreground size-16" />
          </div>
        ) : isTopicError ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <AlertTriangle className="text-destructive size-16" />
            <p className="text-muted-foreground text-xl font-semibold">
              {isNotFoundError ? "토픽을 찾을 수 없어요." : "토픽을 불러오는데 실패했어요."}
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            connectionLineStyle={connectionLineStyle}
            defaultEdgeOptions={defaultEdgeOptions}
          >
            <Background />
          </ReactFlow>
        )}
      </div>
    </ContextMenuProvider>
  );
}
