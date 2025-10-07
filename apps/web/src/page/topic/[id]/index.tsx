"use client";

import { useCallback, useEffect, useState } from "react";

import AddContentList from "@/components/(with-side-bar)/topic/add-content-list";
import AddStickerDialog from "@/components/(with-side-bar)/topic/add-sticker-dialog";
import AddTopicDialog from "@/components/(with-side-bar)/topic/add-topic-dialog";
import FlowCanvas from "@/components/(with-side-bar)/topic/flow-canvas";
import RemoveContentButton from "@/components/(with-side-bar)/topic/remove-content-button";
import SummarizeDialog from "@/components/(with-side-bar)/topic/summarize-dialog";
import SearchHeader from "@/components/common/search-header";
import type { ContentTypeOptions } from "@/constants/content";
import { useCreateConnection, useRemoveConnection } from "@/lib/tanstack/mutation/connection";
import { useGetTopicBoardById } from "@/lib/tanstack/query/topic";
import { infoToast } from "@linkyboard/components";
import type { Connection, Edge, Node } from "@xyflow/react";
import { addEdge, ReactFlowProvider, useEdgesState, useNodesState } from "@xyflow/react";

import { Plus } from "lucide-react";

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

  const isNotFoundError = !isLoading && error?.message.includes("404");

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
  }, [id, isLoading, isRefetching]);

  return (
    <div className="flex flex-col">
      <header className="bg-background mb-6 flex items-center justify-between">
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

      <div className="flex h-[calc(100vh-200px)] gap-0">
        <AddContentList isTopicLoading={isLoading} nodes={data?.nodes || []} id={id} type={type} />

        <ReactFlowProvider>
          <FlowCanvas
            isLoading={isLoading}
            isTopicError={isError}
            isNotFoundError={isNotFoundError || false}
            id={id}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            selectedNodeIds={selectedNodeIds}
            onNodeSelect={onNodeSelect}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
