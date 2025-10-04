"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import AddTopicDialog from "@/components/(with-side-bar)/layout/add-topic-dialog";
import SearchHeader from "@/components/(with-side-bar)/layout/search-header";
import ResizeBar from "@/components/resize-bar";
import AddStickerDialog from "@/components/topic/add-sticker-dialog";
import ContentList from "@/components/topic/content-list";
import EditTopicSidebar from "@/components/topic/edit-sticker-sidebar";
import FlowCanvas from "@/components/topic/flow-canvas";
import RemoveContentButton from "@/components/topic/remove-content-button";
import SummarizeDialog from "@/components/topic/summarize-dialog";
import type { ContentTypeOptions } from "@/constants/content";
import { useCreateConnection, useRemoveConnection } from "@/lib/tanstack/mutation/connection";
import { useGetTopicById } from "@/lib/tanstack/query/topic";
import { infoToast } from "@linkyboard/components";
import type { Connection, Edge, Node } from "@xyflow/react";
import { addEdge, ReactFlowProvider, useEdgesState, useNodesState } from "@xyflow/react";

import { Plus } from "lucide-react";

interface TopicBoardPageProps {
  id: string;
  type: ContentTypeOptions;
}

const initialNodes: Node[] = [];

const MIN_WIDTH = 300;
const MAX_WIDTH = 600;

export default function TopicBoardPage({ id, type }: TopicBoardPageProps) {
  const [contentPanelWidth, setContentPanelWidth] = useState(300); // Content Panel 기본 너비
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  const contentPanelRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError, error, isRefetching } = useGetTopicById(id);

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

  // 드래그 앤 드롭 핸들러
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const onMouseMove = (e: MouseEvent) => {
    const container = contentPanelRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;

    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setContentPanelWidth(newWidth);
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
        <ContentList
          contentPanelRef={contentPanelRef}
          contentPanelWidth={contentPanelWidth}
          isTopicLoading={isLoading}
          nodes={data?.nodes || []}
          id={id}
          type={type}
        />

        <ResizeBar onMouseMove={onMouseMove} />

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
            onDragOver={onDragOver}
            selectedNodeIds={selectedNodeIds}
            onNodeSelect={onNodeSelect}
          />
        </ReactFlowProvider>
      </div>

      {/* useSearchParams 때문에 Suspense 사용 */}
      <Suspense>
        <EditTopicSidebar />
      </Suspense>
    </div>
  );
}
