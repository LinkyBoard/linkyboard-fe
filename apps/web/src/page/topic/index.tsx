"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ContentItem from "@/components/(with-side-bar)/library/content-item";
import CustomNode from "@/components/topic/custom-node";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recentActivitiesData } from "@/constants/sample-data";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import { useTopicStore } from "@/lib/zustand/topic-store";
import { KnowledgeItemProps } from "@/types/library";
import { infoToast } from "@/utils/toast";
import { cn } from "@repo/ui/utils/cn";
import {
  addEdge,
  Background,
  Connection,
  Edge,
  Node,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import { Lightbulb, Menu, Plus, Search } from "lucide-react";

interface TopicBoardPageProps {
  id: string;
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 0, y: 0 },
    data: { nodeContent: "topic", item: { title: "test", summary: "test" } },
  },
];

const connectionLineStyle = {
  stroke: "#b1b1b7",
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export default function TopicBoardPage({ id }: TopicBoardPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contentPanelWidth, setContentPanelWidth] = useState(300); // Content Panel 기본 너비
  const [isResizing, setIsResizing] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback(
    (params: Connection) => {
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
    [setEdges, edges]
  );

  const contentPanelRef = useRef<HTMLDivElement>(null);

  const { toggle } = useMobileMenuStore();
  const topicStore = useTopicStore();

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onNewTopicClick = () => {
    topicStore.setEditingTopic(null);
    topicStore.setShowNewTopicModal(true);
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

  const onAddContent = (content: KnowledgeItemProps) => {
    const newNode: Node = {
      id: `content-${content.id}`,
      type: "custom",
      position: { x: 0, y: 0 },
      data: { nodeContent: "content", item: content },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
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

  return (
    <div>
      {/* Header */}
      <header className="border-border mb-8 flex items-center justify-between border-b pb-4">
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
        {/* Content Panel */}
        <div
          ref={contentPanelRef}
          className="bg-card border-border overflow-hidden rounded-l-lg border border-r-0"
          style={{ width: `${contentPanelWidth}px`, minWidth: "300px" }}
        >
          <div className="relative p-4">
            <Search
              className="text-muted-foreground absolute top-1/2 left-8 -translate-y-1/2 transform"
              size={16}
            />
            <Input
              type="text"
              placeholder="콘텐츠를 검색하세요"
              className="pl-10"
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
          <div className="h-[calc(100%-120px)] space-y-3 overflow-y-auto p-4">
            {recentActivitiesData.map((item) => (
              <ContentItem
                key={`${item.title}-knowledge-item`}
                item={item}
                onClick={() => onAddContent(item)}
              />
            ))}
          </div>
        </div>

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
          {id ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
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
    </div>
  );
}
