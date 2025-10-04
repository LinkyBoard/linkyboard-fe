"use client";

import { useMemo } from "react";

import { useCreateContent } from "@/lib/tanstack/mutation/topic-content";
import type { CategoryContentDTO } from "@linkyboard/types";
import type { Connection, Edge, Node, NodeProps, NodeTypes } from "@xyflow/react";
import {
  Background,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";

import { AlertTriangle, Lightbulb, Loader2, Plus } from "lucide-react";

import CustomNode from "./custom-node";
import AddTopicDialog from "../(with-side-bar)/layout/add-topic-dialog";

interface FlowCanvasProps {
  isLoading: boolean;
  isTopicError: boolean;
  isNotFoundError: boolean;
  id: string;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: (params: Connection) => void;
  onEdgeClick: (e: React.MouseEvent, edge: Edge) => void;
  onDragOver: (e: React.DragEvent) => void;
  selectedNodeIds: string[];
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

const FlowCanvas = ({
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
  onDragOver,
  selectedNodeIds,
  onNodeSelect,
}: FlowCanvasProps) => {
  const { screenToFlowPosition } = useReactFlow();
  const { mutateAsync: createContent } = useCreateContent(id);

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      custom: (props: NodeProps) => (
        <CustomNode
          {...props}
          key={`topic-nodes-${id}`}
          topicId={id}
          isSelected={selectedNodeIds.includes(props.id)}
          onSelect={onNodeSelect}
        />
      ),
    }),
    [selectedNodeIds, id]
  );

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
    <div
      className="relative flex-1 overflow-hidden rounded-r-lg border border-l-0"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {isLoading || isTopicError ? (
        <div className="flex h-full flex-col items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="text-muted-foreground size-16 animate-spin" />
              <p className="text-muted-foreground text-xl font-semibold">토픽을 불러오고 있어요</p>
            </>
          ) : (
            <>
              <AlertTriangle className="text-destructive size-16" />
              <p className="text-muted-foreground text-xl font-semibold">
                {isNotFoundError ? "토픽을 찾을 수 없어요." : "토픽을 불러오는데 실패했어요."}
              </p>
            </>
          )}
        </div>
      ) : id ? (
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
      ) : (
        <div className="bg-background absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center">
            <Lightbulb size={64} className="text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="mb-4 text-xl font-semibold">선택된 토픽이 없습니다</h3>
            <p className="text-muted-foreground mb-6">토픽을 선택하거나 새 토픽을 생성해보세요</p>
            <AddTopicDialog>
              <Plus size={16} />새 토픽 생성
            </AddTopicDialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowCanvas;
