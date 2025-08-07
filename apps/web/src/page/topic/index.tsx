"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import {
  type ContentItem,
  type DraggableItem,
  type Topic,
  useTopicStore,
} from "@/lib/zustand/topic-store";
import { infoToast } from "@/utils/toast";
import { cn } from "@repo/ui/utils/cn";

import {
  Bot,
  Edit,
  FileText,
  Globe,
  Lightbulb,
  Menu,
  Move,
  Plus,
  Search,
  Share,
  StickyNote,
  Trash2,
  X,
  Youtube,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface TopicBoardPageProps {
  id: string;
}

const contentItems: ContentItem[] = [
  {
    id: 1,
    title: "콘텐츠 기반 필터링",
    description: "콘텐츠 기반 필터링은 사용자 행동·피드백으로 얻은 정보를 바탕으로...",
    type: "web",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "유튜브 필터링 알고리즘",
    description: "공식 오피셜 자료 다 가져가세요",
    type: "youtube",
    date: "2024-03-10",
  },
  {
    id: 3,
    title: "Collaborative Filtering in Recommender System",
    description: "협업 필터링은 다수 사용자 선호도를 기반으로 유사한 사용자나 아이템을 찾아...",
    type: "web",
    date: "2024-03-05",
  },
];

export default function TopicBoardPage({ id }: TopicBoardPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isEmptyState, setIsEmptyState] = useState(true);
  const [topicForm, setTopicForm] = useState({ title: "", description: "" });
  const [selectedContent, setSelectedContent] = useState<DraggableItem | null>(null);
  const [contentPanelWidth, setContentPanelWidth] = useState(300); // Content Panel 기본 너비
  const [isResizing, setIsResizing] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentPanelRef = useRef<HTMLDivElement>(null);
  const stickyBoardRef = useRef<HTMLDivElement>(null);

  const { toggle } = useMobileMenuStore();
  const topicStore = useTopicStore();

  // URL 파라미터에서 토픽 ID를 읽어와서 해당 토픽을 로드
  useEffect(() => {
    if (id) {
      const topicId = parseInt(id);
      const topic = topicStore.getTopicById(topicId);
      if (topic) {
        setSelectedTopic(topic);
        setIsEmptyState(false);
        onResetView();
      }
    }
  }, [id]);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onNewTopicClick = () => {
    topicStore.setEditingTopic(null);
    setTopicForm({ title: "", description: "" });
    topicStore.setShowNewTopicModal(true);
  };

  const onFilterClick = (filter: string) => {
    setSelectedFilter(filter);
  };

  const onDragStart = (e: React.DragEvent, content: ContentItem) => {
    // 드래그 딜레이 제거를 위한 즉시 시각적 피드백
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
    (e.currentTarget as HTMLElement).style.transform = "scale(0.95)";

    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        type: content.type,
        title: content.title,
        description: content.description,
      })
    );
  };

  const onDragEnd = (e: React.DragEvent) => {
    // 드래그 종료 시 스타일 복원
    (e.currentTarget as HTMLElement).style.opacity = "1";
    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    // 드래그 오버 시 캔버스 하이라이트
    if (selectedTopic) {
      (e.currentTarget as HTMLElement).style.border = "2px dashed hsl(var(--primary))";
      (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(85, 85, 255, 0.05)";
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();

    // 드래그 오버 스타일 제거
    (e.currentTarget as HTMLElement).style.border = "";
    (e.currentTarget as HTMLElement).style.backgroundColor = "";

    if (!selectedTopic) {
      return infoToast("먼저 토픽을 선택해주세요.");
    }

    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const rect = canvasRef.current?.getBoundingClientRect();

    if (rect) {
      // 줌과 패닝을 고려한 드롭 위치 계산
      const dropX = (e.clientX - rect.left - pan.x) / zoom - 100;
      const dropY = (e.clientY - rect.top - pan.y) / zoom - 50;

      // 중복 콘텐츠 체크
      const existingContent = selectedTopic.contents.find(
        (content) => content.title === data.title
      );

      if (existingContent) {
        return infoToast("이미 추가된 콘텐츠입니다.");
      }

      const newContent: ContentItem = {
        id: Date.now() + Math.random(),
        title: data.title,
        description: data.description,
        type: data.type,
        date: new Date().toISOString().split("T")[0],
        x: dropX,
        y: dropY,
      };

      const updatedTopic = {
        ...selectedTopic,
        contents: [...selectedTopic.contents, newContent],
      };

      setSelectedTopic(updatedTopic);
      topicStore.updateTopic(updatedTopic);
    }
  };

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (isEmptyState || isResizing) return;

    if (
      !(e.target as HTMLElement).closest(".sticky-topic") &&
      !(e.target as HTMLElement).closest(".content-sticky") &&
      !(e.target as HTMLElement).closest(".sticky-action-btn")
    ) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const onCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        // 피그마 스타일: 줌과 패닝을 고려한 정확한 마우스 위치 계산
        const mouseX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;

        // 드래그 오프셋은 줌 레벨에 관계없이 일정하게 유지
        const x = mouseX - dragOffset.x;
        const y = mouseY - dragOffset.y;

        if (selectedContent && selectedContent.id === selectedTopic?.id) {
          // 토픽 스티커 드래그
          const updatedTopic = { ...selectedTopic, x, y };
          setSelectedTopic(updatedTopic);
          topicStore.updateTopic(updatedTopic);
        } else if (selectedContent && selectedTopic && "type" in selectedContent) {
          // 콘텐츠 스티커 드래그 (타입 가드로 ContentItem 확인)
          const updatedContent = { ...selectedContent, x, y } as ContentItem;
          setSelectedContent(updatedContent);

          const updatedTopic = {
            ...selectedTopic,
            contents: selectedTopic.contents.map((c) =>
              c.id === updatedContent.id ? updatedContent : c
            ),
          };
          setSelectedTopic(updatedTopic);
          topicStore.updateTopic(updatedTopic);
        }
      }
    } else if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;

      setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const onCanvasMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setSelectedContent(null);
    }
    if (isPanning) {
      setIsPanning(false);
    }
  };

  const onZoomIn = () => {
    if (isEmptyState || isDragging || isResizing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      // 피그마 스타일: 화면 중심을 기준으로 줌
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const newZoom = Math.min(3, zoom * 1.2);
      const zoomRatio = newZoom / zoom;

      setPan((prev) => ({
        x: centerX - (centerX - prev.x) * zoomRatio,
        y: centerY - (centerY - prev.y) * zoomRatio,
      }));

      setZoom(newZoom);
    }
  };

  const onZoomOut = () => {
    if (isEmptyState || isDragging || isResizing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      // 피그마 스타일: 화면 중심을 기준으로 줌
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const newZoom = Math.max(0.1, zoom / 1.2);
      const zoomRatio = newZoom / zoom;

      setPan((prev) => ({
        x: centerX - (centerX - prev.x) * zoomRatio,
        y: centerY - (centerY - prev.y) * zoomRatio,
      }));

      setZoom(newZoom);
    }
  };

  const onResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onCenterView = () => {
    if (selectedTopic) {
      // 토픽과 모든 콘텐츠를 화면 중앙에 배치
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const centerX = canvasRect.width / 2;
        const centerY = canvasRect.height / 2;

        // 모든 요소의 평균 위치 계산
        const allItems = [selectedTopic, ...selectedTopic.contents];
        const avgX = allItems.reduce((sum, item) => sum + (item.x || 0), 0) / allItems.length;
        const avgY = allItems.reduce((sum, item) => sum + (item.y || 0), 0) / allItems.length;

        // 중앙으로 이동하기 위한 패닝 계산
        const targetPanX = centerX - avgX * zoom;
        const targetPanY = centerY - avgY * zoom;

        setPan({ x: targetPanX, y: targetPanY });
      }
    }
  };

  const onStickyMouseDown = (e: React.MouseEvent, content: ContentItem) => {
    if ((e.target as HTMLElement).closest(".sticky-action-btn")) return;

    e.stopPropagation();
    setIsDragging(true);
    setSelectedContent(content);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      // 피그마 스타일: 줌과 패닝을 고려한 정확한 오프셋 계산
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      // 스티커의 실제 위치
      const stickyX = content.x || 0;
      const stickyY = content.y || 0;

      // 드래그 오프셋 계산 (줌 레벨에 관계없이 일정)
      setDragOffset({
        x: mouseX - stickyX,
        y: mouseY - stickyY,
      });
    }
  };

  const onTopicMouseDown = (e: React.MouseEvent, topic: Topic) => {
    if ((e.target as HTMLElement).closest(".sticky-action-btn")) return;

    e.stopPropagation();
    setIsDragging(true);
    setSelectedContent(topic); // 토픽을 selectedContent로 설정하여 드래그 로직 통일

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      // 피그마 스타일: 줌과 패닝을 고려한 정확한 오프셋 계산
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      // 스티커의 실제 위치
      const stickyX = topic.x || 0;
      const stickyY = topic.y || 0;

      // 드래그 오프셋 계산 (줌 레벨에 관계없이 일정)
      setDragOffset({
        x: mouseX - stickyX,
        y: mouseY - stickyY,
      });
    }
  };

  const onSelectSticky = (content: ContentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedContent(content);
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

  const onRemoveContent = (contentId: number) => {
    if (selectedTopic) {
      const updatedTopic = {
        ...selectedTopic,
        contents: selectedTopic.contents.filter((c) => c.id !== contentId),
      };
      setSelectedTopic(updatedTopic);
      topicStore.updateTopic(updatedTopic);
    }
  };

  const onEditTopic = (topic: Topic) => {
    topicStore.setEditingTopic(topic);
    setTopicForm({ title: topic.title, description: topic.description });
    topicStore.setShowNewTopicModal(true);
  };

  const onDeleteTopic = (topicId: number) => {
    if (confirm("이 토픽을 삭제하시겠습니까?")) {
      topicStore.deleteTopic(topicId);

      if (selectedTopic?.id === topicId) {
        setSelectedTopic(null);
        setIsEmptyState(true);
        onResetView();
      }
    }
  };

  const onCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();

    if (topicStore.editingTopic) {
      // 편집 모드
      const updatedTopic = {
        ...topicStore.editingTopic,
        title: topicForm.title,
        description: topicForm.description,
      };
      topicStore.updateTopic(updatedTopic);

      if (selectedTopic?.id === updatedTopic.id) {
        setSelectedTopic(updatedTopic);
      }
    } else {
      // 중복 토픽 체크
      const existingTopic = topicStore.topics.find(
        (topic) => topic.title.toLowerCase() === topicForm.title.toLowerCase()
      );

      if (existingTopic) {
        return infoToast("이미 존재하는 토픽입니다.");
      }

      // 새 토픽 생성 (초기 위치 설정)
      const newTopic: Topic = {
        id: Date.now(),
        title: topicForm.title,
        description: topicForm.description,
        contents: [],
        x: 50,
        y: 50,
        createdAt: new Date().toISOString(),
      };
      topicStore.addTopic(newTopic);
      setSelectedTopic(newTopic);
      setIsEmptyState(false);
      onResetView();

      // URL 업데이트하여 새로 생성된 토픽으로 이동
      router.push(`/topic?id=${newTopic.id}`);
    }

    topicStore.setShowNewTopicModal(false);
  };

  const getContentIcon = (type: string) => {
    const iconMap = {
      web: Globe,
      youtube: Youtube,
      pdf: FileText,
      note: StickyNote,
    };
    return iconMap[type as keyof typeof iconMap] || FileText;
  };

  const getContentTypeName = (type: string) => {
    const typeMap = {
      web: "웹",
      youtube: "YouTube",
      pdf: "PDF",
      note: "메모",
    };
    return typeMap[type as keyof typeof typeMap] || "파일";
  };

  const filteredContentItems = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || item.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(".search-input") as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, []);

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

  // Wheel 이벤트 처리 (passive 이벤트 리스너 문제 해결)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      if (isEmptyState || isDragging || isResizing) return;

      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      if (rect) {
        // 피그마 스타일: 마우스 위치를 중심으로 줌
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(3, zoom * delta));

        // 줌 중심점 계산
        const zoomRatio = newZoom / zoom;
        setPan((prev) => ({
          x: mouseX - (mouseX - prev.x) * zoomRatio,
          y: mouseY - (mouseY - prev.y) * zoomRatio,
        }));

        setZoom(newZoom);
      }
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [isEmptyState, isDragging, isResizing, zoom]);

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
          <div className="border-border border-b p-6">
            <div className="relative mb-4">
              <Search
                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
                size={16}
              />
              <Input
                type="text"
                placeholder="콘텐츠 추가..."
                className="pl-10"
                value={searchQuery}
                onChange={onSearchChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "web", "youtube", "pdf", "note"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterClick(filter)}
                  className="text-xs"
                >
                  {filter === "all"
                    ? "전체"
                    : filter === "web"
                      ? "웹"
                      : filter === "youtube"
                        ? "YouTube"
                        : filter === "pdf"
                          ? "PDF"
                          : "메모"}
                </Button>
              ))}
            </div>
          </div>
          <div className="h-[calc(100%-120px)] overflow-y-auto p-4">
            {filteredContentItems.map((item) => {
              const IconComponent = getContentIcon(item.type);
              return (
                <div
                  key={item.id}
                  className="bg-background border-border mb-4 cursor-grab rounded-lg border p-4 transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg"
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                  onDragEnd={onDragEnd}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md",
                        item.type === "web"
                          ? "bg-blue-100 text-blue-600"
                          : item.type === "youtube"
                            ? "bg-red-100 text-red-600"
                            : item.type === "pdf"
                              ? "bg-green-100 text-green-600"
                              : "bg-orange-100 text-orange-600"
                      )}
                    >
                      <IconComponent size={16} />
                    </div>
                    <div className="text-sm font-semibold">{item.title}</div>
                  </div>
                  <div className="text-muted-foreground mb-2 text-xs">{item.description}</div>
                  <div className="text-muted-foreground text-xs">마지막 편집: {item.date}</div>
                </div>
              );
            })}
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
          <div
            ref={canvasRef}
            className={cn(
              "bg-background h-full w-full cursor-grab",
              isPanning ? "cursor-grabbing" : ""
            )}
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onCanvasMouseMove}
            onMouseUp={onCanvasMouseUp}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={(e) => {
              // 드래그가 캔버스 컨테이너를 벗어날 때 스타일 제거
              (e.currentTarget as HTMLElement).style.border = "";
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
            }}
          >
            {/* Empty State */}
            {isEmptyState && (
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

            {/* Sticky Board */}
            {!isEmptyState && selectedTopic && (
              <div
                ref={stickyBoardRef}
                className="pointer-events-none absolute inset-0 p-8"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "0 0",
                  width: "100%",
                  height: "100%",
                  overflow: "visible",
                }}
              >
                {/* Topic Sticky */}
                <div
                  className="sticky-topic from-primary pointer-events-auto absolute z-10 max-w-[450px] min-w-[350px] cursor-grab rounded-2xl bg-gradient-to-br to-blue-600 p-8 text-white shadow-xl backdrop-blur-sm hover:-translate-y-1 hover:scale-[1.02] hover:transform"
                  style={{
                    // left: Math.max(-500, Math.min(1500, selectedTopic.x || 50)),
                    left: selectedTopic.x,
                    top: selectedTopic.y,
                  }}
                  onMouseDown={(e) => onTopicMouseDown(e, selectedTopic)}
                  onMouseUp={() => {
                    if (isDragging) {
                      setIsDragging(false);
                      setSelectedContent(null);
                    }
                  }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                      <Lightbulb size={24} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-white/20 text-white hover:bg-white/30"
                        onClick={() => onEditTopic(selectedTopic)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-white/20 text-white hover:bg-white/30"
                        onClick={() => onDeleteTopic(selectedTopic.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-3 text-2xl leading-tight font-bold">{selectedTopic.title}</h2>
                    <p className="text-lg leading-relaxed opacity-90">
                      {selectedTopic.description}
                    </p>
                  </div>
                </div>

                {/* Content Stickies */}
                {selectedTopic.contents.map((content) => {
                  const IconComponent = getContentIcon(content.type);
                  return (
                    <div
                      key={content.id}
                      className="content-sticky bg-card border-border hover:border-primary pointer-events-auto absolute z-5 max-w-[320px] min-w-[280px] cursor-grab rounded-2xl border p-6 shadow-lg backdrop-blur-sm hover:-translate-y-1 hover:scale-[1.02] hover:transform hover:shadow-xl"
                      style={{
                        left: content.x,
                        top: content.y,
                      }}
                      onMouseDown={(e) => onStickyMouseDown(e, content)}
                      onMouseUp={() => {
                        if (isDragging) {
                          setIsDragging(false);
                          setSelectedContent(null);
                        }
                      }}
                      onClick={(e) => onSelectSticky(content, e)}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl text-xl",
                            content.type === "web"
                              ? "bg-blue-100 text-blue-600"
                              : content.type === "youtube"
                                ? "bg-red-100 text-red-600"
                                : content.type === "pdf"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-orange-100 text-orange-600"
                          )}
                        >
                          <IconComponent size={20} />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-muted text-muted-foreground hover:bg-destructive h-8 w-8 hover:text-white"
                          onClick={() => onRemoveContent(content.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <div>
                        <h3 className="text-foreground mb-3 text-lg leading-tight font-semibold">
                          {content.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                          {content.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-medium tracking-wider uppercase",
                              content.type === "web"
                                ? "bg-blue-100 text-blue-600"
                                : content.type === "youtube"
                                  ? "bg-red-100 text-red-600"
                                  : content.type === "pdf"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-orange-100 text-orange-600"
                            )}
                          >
                            {getContentTypeName(content.type)}
                          </span>
                          <span className="text-muted-foreground text-xs">{content.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          {!isEmptyState && (
            <div className="bg-card border-border absolute right-4 bottom-4 z-20 flex items-center gap-2 rounded-lg border p-3 shadow-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => console.log("Edit")}
                title="편집"
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => console.log("AI")}
                title="AI 도움"
              >
                <Bot size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => console.log("Share")}
                title="공유"
              >
                <Share size={16} />
              </Button>
              <div className="bg-border h-6 w-px" />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={onCenterView}
                title="화면 중앙으로 이동"
              >
                <Move size={16} />
              </Button>
              <div className="bg-border h-6 w-px" />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={onZoomOut}
                title="축소"
              >
                <ZoomOut size={16} />
              </Button>
              <div className="min-w-[40px] text-center text-sm font-medium">
                {Math.round(zoom * 100)}%
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={onZoomIn}
                title="확대"
              >
                <ZoomIn size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
