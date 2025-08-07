"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@repo/ui/utils/cn";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";

import {
  Bell,
  Bookmark,
  Bot,
  ExternalLink,
  File,
  FileText,
  Lightbulb,
  Link,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Search,
  Star,
  StickyNote,
  User,
} from "lucide-react";

const summaryCards = [
  { icon: Bookmark, number: 24, label: "저장된 항목", color: "blue", href: "/library" },
  { icon: Star, number: 5, label: "토픽", color: "green", href: "/topic" },
  { icon: Lightbulb, number: 18, label: "AI 인사이트", color: "purple", href: "/dashboard" },
];

const recentActivities = [
  {
    type: "아티클",
    time: "2시간 전",
    title: "디자인 시스템에서 AI의 미래",
    description:
      "디자인 시스템을 구축하고 유지하는 방식에 인공지능이 어떻게 혁신을 가져오는지에 대한 포괄적인 가이드...",
    tags: ["AI", "디자인"],
    icon: FileText,
    iconColor: "blue",
  },
  {
    type: "PDF",
    time: "5시간 전",
    title: "프로덕트 관리 베스트 프랙티스",
    description: "성공적인 프로덕트 관리와 팀 협업을 위한 실용적인 방법론과 도구들...",
    tags: ["프로덕트", "관리"],
    icon: File,
    iconColor: "red",
  },
  {
    type: "노트",
    time: "1일 전",
    title: "사용자 경험 설계 아이디어",
    description: "다음 프로젝트에서 적용할 수 있는 혁신적인 UX 패턴과 인터랙션 아이디어들...",
    tags: ["UX", "디자인"],
    icon: StickyNote,
    iconColor: "green",
  },
];

const aiInsights = [
  {
    title: "연결 발견",
    description:
      "최근 저장한 'AI 디자인' 관련 콘텐츠와 '사용자 경험' 토픽 간의 흥미로운 연결점을 발견했습니다.",
    buttonText: "연결 확인",
    gradient: "from-blue-500 to-purple-600",
    icon: Link,
  },
  {
    title: "추천 콘텐츠",
    description: "현재 작업 중인 프로젝트와 관련된 3개의 새로운 아티클을 추천합니다.",
    buttonText: "추천 보기",
    gradient: "from-green-500 to-teal-600",
    icon: Lightbulb,
  },
  {
    title: "요약 생성",
    description: "지난 주에 수집한 12개의 콘텐츠를 바탕으로 주간 학습 요약을 생성했습니다.",
    buttonText: "요약 보기",
    gradient: "from-orange-500 to-red-600",
    icon: FileText,
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { toggle } = useMobileMenuStore();

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onInsightClick = (action: string) => {
    console.log("Insight action:", action);
  };

  const onActionClick = (title: string) => {
    console.log("Activity clicked:", title);
  };

  const onActivityClick = (title: string) => {
    console.log("Activity clicked:", title);
  };

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
            {/* 검색 결과 네이버 검색 참고하기 */}
            <Input
              type="text"
              placeholder="콘텐츠를 검색하세요"
              className="pl-10"
              value={searchQuery}
              onChange={onSearchChange}
              aria-label="콘텐츠 검색"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onActionClick("AI 어시스턴트")}
            aria-label="AI 어시스턴트"
          >
            <Bot size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => onActionClick("알림")}
            aria-label="알림"
          >
            <Bell size={20} />
            <div className="bg-destructive absolute -top-1 -right-1 h-2 w-2 rounded-full" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onActionClick("사용자 프로필")}
            aria-label="사용자 프로필"
          >
            <User size={20} />
          </Button>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">좋은 아침입니다! 👋</h1>
        <p className="text-muted-foreground text-lg">오늘 콘텐츠 관리 현황을 확인해보세요</p>
      </section>

      {/* Summary Cards */}
      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {summaryCards.map((card) => (
          <button
            key={card.label}
            className="bg-card border-border rounded-lg border p-6 text-start transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg"
            onClick={() => router.push(card.href)}
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-md",
                  card.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : card.color === "green"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                )}
              >
                <card.icon size={24} />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold">{card.number}</div>
            <div className="text-muted-foreground text-sm">{card.label}</div>
          </button>
        ))}
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <section className="bg-card border-border overflow-hidden rounded-lg border lg:col-span-2">
          <div className="border-border flex items-center justify-between border-b p-6">
            <h2 className="text-lg font-semibold">최근 활동</h2>
            <Button variant="ghost" size="icon" aria-label="더보기">
              <MoreHorizontal size={20} />
            </Button>
          </div>
          <div className="p-6">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="border-border hover:bg-accent/50 flex cursor-pointer gap-4 rounded-md border-b p-2 py-4 transition-colors duration-300 last:border-b-0"
                onClick={() => onActivityClick(activity.title)}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md",
                    activity.iconColor === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : activity.iconColor === "red"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                  )}
                >
                  <activity.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="bg-accent text-accent-foreground rounded px-2 py-1 text-xs font-medium">
                      {activity.type}
                    </span>
                    <span className="text-muted-foreground text-xs">{activity.time}</span>
                  </div>
                  <h3 className="mb-2 leading-tight font-semibold">{activity.title}</h3>
                  <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                    {activity.description}
                  </p>
                  <div className="mb-3 flex gap-2">
                    {activity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" aria-label="더보기">
                    <MoreVertical size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="문서 보기">
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Insights */}
        <section className="bg-card border-border overflow-hidden rounded-lg border">
          <div className="border-border border-b p-6">
            <h2 className="text-lg font-semibold">오늘의 AI 인사이트</h2>
          </div>
          <div className="space-y-6 p-6">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={cn("bg-gradient-to-br", insight.gradient, "rounded-lg p-6 text-white")}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/20">
                    <insight.icon size={20} />
                  </div>
                  <div className="text-lg font-semibold">{insight.title}</div>
                </div>
                <p className="mb-4 leading-relaxed opacity-90">{insight.description}</p>
                <Button
                  variant="white"
                  size="sm"
                  className="transform shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  onClick={() => onInsightClick(insight.buttonText)}
                >
                  {insight.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
