"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { edgeServerAppPaths } from "next/dist/build/webpack/plugins/pages-manifest-plugin";

import AddTopicDialog from "@/components/(with-side-bar)/layout/add-topic-dialog";
import AddStickerDialog from "@/components/topic/add-sticker-dialog";
import ContentList from "@/components/topic/content-list";
import EditTopicSidebar from "@/components/topic/edit-sticker-sidebar";
import FlowCanvas from "@/components/topic/flow-canvas";
import RemoveContentButton from "@/components/topic/remove-content-button";
import SummarizeDialog from "@/components/topic/summarize-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContentTypeOptions } from "@/constants/content";
import { dummyEdges, dummyNodes } from "@/constants/dummy-data";
import { useCreateConnection, useRemoveConnection } from "@/lib/tanstack/mutation/connection";
import { useGetTopicById } from "@/lib/tanstack/query/topic";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import { useTopicStore } from "@/lib/zustand/topic";
import { infoToast } from "@/utils/toast";
import {
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import { Menu, Plus, Search } from "lucide-react";

interface TopicBoardPageProps {
  id: string;
  type: ContentTypeOptions;
}

export default function TopicBoardPage({ id, type }: TopicBoardPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contentPanelWidth, setContentPanelWidth] = useState(300); // Content Panel 기본 너비
  const [isResizing, setIsResizing] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const contents = useTopicStore((state) => state.contents);

  const contentPanelRef = useRef<HTMLDivElement | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const { toggle } = useMobileMenuStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(contents.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(contents.edges);

  // 초기 로드 시에만 Zustand 스토어에서 데이터 가져오기
  useEffect(() => {
    if (nodes.length === 0 && contents.nodes.length > 0) {
      setNodes(contents.nodes);
    }
  }, [contents.nodes, setNodes, nodes.length]);

  useEffect(() => {
    if (edges.length === 0 && contents.edges.length > 0) {
      setEdges(contents.edges);
    }
  }, [contents.edges, setEdges, edges.length]);

  const onNodeSelect = (nodeId: string) => {
    setSelectedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  // 새로운 노드 추가 시 React Flow 상태와 동기화
  const addNodeToFlow = useCallback(
    (type: string, item: any) => {
      const newNode = {
        id: `${type}-${item.id}`,
        data: {
          item,
          nodeContent: type,
        },
        position: { x: 0, y: 0 },
        measured: { height: 0, width: 0 },
        type: "custom",
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  // 새로운 엣지 추가 시 React Flow 상태와 동기화
  const addEdgesToFlow = useCallback(
    (newEdges: any[]) => {
      setEdges((eds) => [...eds, ...newEdges]);
    },
    [setEdges]
  );

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

      setEdges((eds) => addEdge(params, eds));
    },
    [edges]
  );

  const onEdgeClick = async (e: React.MouseEvent, edge: Edge) => {
    const edgeData = edges.find((e) => e.id === edge.id);
    if (!edgeData) return;

    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    try {
      // await removeConnection(edge.id);
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      infoToast("연결이 제거되었습니다.");
    } catch (error) {
      setEdges((eds) => addEdge(edgeData, eds));
    }
  };

  // 드래그 앤 드롭 핸들러
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const onMouseMove = (e: MouseEvent) => {
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
  console.log(nodes, edges);
  const onMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      };
    }
  }, [isResizing]);

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
                addNodeToFlow={addNodeToFlow}
                addEdgesToFlow={addEdgesToFlow}
              />
            </>
          )}
          <AddTopicDialog>
            <Plus size={16} />새 토픽
          </AddTopicDialog>
          <AddStickerDialog addNodeToFlow={addNodeToFlow} />
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
          className="bg-border hover:bg-primary/20 relative w-1 cursor-col-resize transition-colors"
          onMouseDown={onResizeStart}
        >
          <div className="bg-muted-foreground/50 absolute top-1/2 left-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Canvas */}
        <ReactFlowProvider>
          <FlowCanvas
            ref={reactFlowWrapper}
            isLoading={false}
            isTopicError={false}
            isNotFoundError={false}
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

      {/* Edit Topic Sidebar */}
      <Suspense>
        <EditTopicSidebar />
      </Suspense>
    </div>
  );
}
