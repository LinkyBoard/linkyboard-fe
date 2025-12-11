"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import AddContent from "@/components/(with-side-bar)/topic/add-content";
import AddStickerDialog from "@/components/(with-side-bar)/topic/add-sticker-dialog";
import AddTopicDialog from "@/components/(with-side-bar)/topic/add-topic-dialog";
import RemoveContentButton from "@/components/(with-side-bar)/topic/remove-content-button";
import SummarizeDialog from "@/components/(with-side-bar)/topic/summarize-dialog";
import SearchHeader from "@/components/common/search-header";
import type { ContentTypeOptions } from "@/constants/content";
import { useCreateConnection, useRemoveConnection } from "@/lib/tanstack/mutation/connection";
import { useGetTopicBoardById } from "@/lib/tanstack/query/topic";
import { infoToast, Spinner } from "@linkyboard/components";
import type { Connection, Edge, Node } from "@xyflow/react";
import { addEdge, useEdgesState, useNodesState } from "@xyflow/react";

import { Plus } from "lucide-react";

const ReactFlowCanvas = dynamic(
  () => import("@/components/(with-side-bar)/topic/react-flow-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="text-muted-foreground size-16" />
      </div>
    ),
  }
);

interface TopicBoardPageProps {
  id: string;
  type: ContentTypeOptions;
}

const initialNodes: Node[] = [];

export default function TopicBoardPage({ id, type }: TopicBoardPageProps) {
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  const { data, isLoading, isError, error, isRefetching } = useGetTopicBoardById(id);

  const { mutateAsync: createConnection } = useCreateConnection();
  const { mutateAsync: removeConnection } = useRemoveConnection();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onNodeSelect = (nodeId: string) => {
    setSelectedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const isNotFoundError = (!isLoading && error?.message.includes("404")) || false;

  const onConnect = useCallback(
    async (params: Connection) => {
      // 연결 유효성 검사: 같은 노드 간에는 하나의 연결만 허용
      const existingConnection = edges.find(
        (edge) =>
          (edge.source === params.source && edge.target === params.target) ||
          (edge.source === params.target && edge.target === params.source)
      );

      if (existingConnection) {
        infoToast("이미 연결된 노드입니다.");
        return;
      }

      const edgeId = `xy-edge__${params.source}${params.sourceHandle}-${params.target}${params.targetHandle}`;
      setEdges((eds) => addEdge(params, eds));

      try {
        await createConnection({
          id: edgeId,
          source: params.source,
          sourceHandle: params.sourceHandle || "",
          target: params.target,
          targetHandle: params.targetHandle || "",
          topicId: id,
        });
      } catch (error) {
        setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      }
    },
    [edges]
  );

  const onEdgeClick = async (e: React.MouseEvent, edge: Edge) => {
    const edgeData = edges.find((e) => e.id === edge.id);
    if (!edgeData) return;

    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    try {
      await removeConnection(edge.id);
    } catch (error) {
      setEdges((eds) => addEdge(edgeData, eds));
    }
  };

  useEffect(() => {
    setSelectedNodeIds([]);

    if (isLoading) {
      setNodes([]);
      setEdges([]);
      return;
    }

    if (id && !isLoading && data) {
      setNodes(data.nodes);
      setEdges(data.edges);
    }
  }, [id, isLoading, isRefetching, data, setNodes, setEdges]);

  return (
    <div className="flex flex-col">
      <header className="mb-6 flex items-center justify-between">
        <SearchHeader placeholder="토픽 보드에서 검색하세요" />
        <div className="flex items-center gap-4">
          {selectedNodeIds.length > 0 && (
            <>
              <RemoveContentButton
                topicId={id}
                selectedNodeIds={selectedNodeIds}
                setSelectedNodeIds={setSelectedNodeIds}
              />
              <SummarizeDialog
                topicId={id}
                selectedNodeIds={selectedNodeIds}
                setSelectedNodeIds={setSelectedNodeIds}
              />
            </>
          )}
          <AddTopicDialog>
            <Plus size={16} />새 토픽
          </AddTopicDialog>
          <AddStickerDialog topicId={id} />
        </div>
      </header>

      <div className="flex h-[calc(100vh-130px)]">
        <AddContent id={id} type={type} />

        <ReactFlowCanvas
          isLoading={isLoading}
          isTopicError={isError}
          isNotFoundError={isNotFoundError}
          id={id}
          nodes={nodes}
          edges={edges}
          selectedNodeIds={selectedNodeIds}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          onNodeSelect={onNodeSelect}
        />
      </div>
    </div>
  );
}
