"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ContentList from "@/components/topic/content-list";
import CustomNode from "@/components/topic/custom-node";
import EditTopicSidebar from "@/components/topic/edit-topic-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContentTypeOptions } from "@/constants/content";
import { useCreateConnection, useRemoveConnection } from "@/lib/tanstack/mutation/connection";
import { useGetTopicById } from "@/lib/tanstack/query/topic";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import { useTopicStore } from "@/lib/zustand/topic-store";
import { infoToast } from "@/utils/toast";
import { cn } from "@repo/ui/utils/cn";
import {
  addEdge,
  Background,
  Connection,
  Edge,
  Node,
  NodeProps,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import { AlertTriangle, Lightbulb, Loader2, Menu, Plus, Search } from "lucide-react";

interface TopicBoardPageProps {
  id: string;
  type: ContentTypeOptions;
}

const initialNodes: Node[] = [];

const connectionLineStyle = {
  stroke: "#b1b1b7",
};

export default function TopicBoardPage({ id, type }: TopicBoardPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contentPanelWidth, setContentPanelWidth] = useState(300); // Content Panel 기본 너비
  const [isResizing, setIsResizing] = useState(false);

  const contentPanelRef = useRef<HTMLDivElement | null>(null);

  const { toggle } = useMobileMenuStore();
  const { setShowNewTopicModal, setEditingTopic } = useTopicStore();

  const {
    data: topic,
    isLoading: isTopicLoading,
    isError: isTopicError,
    error,
    isRefetching,
  } = useGetTopicById(id);
  const { mutateAsync: createConnection } = useCreateConnection();
  const { mutateAsync: removeConnection } = useRemoveConnection();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const isLoading = isTopicLoading;
  const isNotFoundError = !isTopicLoading && error?.message.includes("404");
  const nodeTypes: NodeTypes = useMemo(() => {
    return {
      custom: (props: NodeProps) => <CustomNode {...props} topicId={id} />,
    };
  }, []);

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
      infoToast("연결이 제거되었습니다.");
    } catch (error) {
      setEdges((eds) => addEdge(edgeData, eds));
    }
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onNewTopicClick = () => {
    setEditingTopic(null);
    setShowNewTopicModal(true);
  };

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const onResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const container = contentPanelRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;

    const minWidth = 300;
    const maxWidth = 600;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setContentPanelWidth(newWidth);
    }
  };

  const onResizeEnd = () => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  // 리사이즈 이벤트 처리
  useEffect(() => {
    if (isResizing) {
      const onMouseMove = (e: MouseEvent) => onResizeMove(e);
      const onMouseUp = () => onResizeEnd();

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [isResizing]);

  useEffect(() => {
    if (id && !isLoading && topic) {
      setNodes(topic.nodes);
      setEdges(topic.edges);
    }
  }, [id, isLoading, isRefetching]);

  return (
    <div className="flex flex-col">
      {/* 헤더 */}
      <header className="bg-background mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggle}
            aria-label="메뉴 토글"
          >
            <Menu size={24} />
          </Button>
          <div className="relative w-96">
            <Search
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
              size={20}
            />
            <Input
              type="text"
              placeholder="토픽 보드에서 검색하세요"
              className="pl-10"
              value={searchQuery}
              onChange={onSearchChange}
              aria-label="토픽 보드 검색"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="default" onClick={onNewTopicClick} className="flex items-center gap-2">
            <Plus size={16} />새 토픽
          </Button>
        </div>
      </header>

      {/* Content Panel */}
      <div className="flex h-[calc(100vh-200px)] gap-0">
        <ContentList
          contentPanelRef={contentPanelRef}
          contentPanelWidth={contentPanelWidth}
          id={id}
          type={type}
        />

        {/* Resize Bar */}
        <div
          className={cn(
            "bg-border hover:bg-primary/20 relative w-1 cursor-col-resize transition-colors",
            isResizing && "bg-primary"
          )}
          onMouseDown={onResizeStart}
        >
          <div className="bg-muted-foreground/50 absolute top-1/2 left-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Canvas */}
        <div className="relative flex-1 overflow-hidden rounded-r-lg border border-l-0">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <Loader2 className="text-muted-foreground size-16 animate-spin" />
              <p className="text-muted-foreground text-xl font-semibold">토픽을 불러오고 있어요</p>
            </div>
          ) : isTopicError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <AlertTriangle className="text-destructive size-16" />
              <p className="text-muted-foreground text-xl font-semibold">
                {isNotFoundError ? "토픽을 찾을 수 없어요." : "토픽을 불러오는데 실패했어요."}
              </p>
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
            >
              <Background />
            </ReactFlow>
          ) : (
            <div className="bg-background absolute inset-0 z-10 flex items-center justify-center">
              <div className="text-center">
                <Lightbulb size={64} className="text-muted-foreground mx-auto mb-6 opacity-50" />
                <h3 className="mb-4 text-xl font-semibold">선택된 토픽이 없습니다</h3>
                <p className="text-muted-foreground mb-6">
                  토픽을 선택하거나 새 토픽을 생성해보세요
                </p>
                <Button onClick={onNewTopicClick} className="mx-auto flex items-center gap-2">
                  <Plus size={16} />새 토픽 생성
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Topic Sidebar */}
      <EditTopicSidebar />
    </div>
  );
}
