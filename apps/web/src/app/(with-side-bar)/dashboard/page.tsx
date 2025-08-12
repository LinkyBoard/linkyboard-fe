"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ContentItem from "@/components/(with-side-bar)/library/content-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recentActivitiesData } from "@/constants/sample-data";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import type { ContentItemProps } from "@/types/library";
import { cn } from "@repo/ui/utils/cn";

import {
  Bell,
  Bookmark,
  Bot,
  FileText,
  Lightbulb,
  Link,
  Menu,
  Search,
  Star,
  User,
} from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "좋은 아침입니다! 👋";
  }
  if (hour >= 12 && hour < 17) {
    return "좋은 오후입니다! 🌞";
  }
  if (hour >= 17 && hour < 22) {
    return "좋은 저녁입니다! 🌆";
  }
  return "좋은 밤입니다! 🌙";
}

const summaryCards = [
  { icon: Bookmark, number: 24, label: "저장된 항목", color: "blue", href: "/library" },
  { icon: Star, number: 5, label: "토픽", color: "green", href: "/topic" },
  { icon: Lightbulb, number: 18, label: "AI 인사이트", color: "purple", href: "/dashboard" },
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

  const onActivityClick = (item: ContentItemProps) => {
    router.push(`/library?category=${item.category}&id=${item.id}`);
  };

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
        <h1 className="mb-2 text-4xl font-bold">{getGreeting()}</h1>
        <p className="text-muted-foreground text-lg">오늘 콘텐츠 관리 현황을 확인해보세요</p>
      </section>

      {/* AI Insights - 맨 위로 이동 */}
      <section className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold">오늘의 AI 인사이트</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

      {/* 나의 활동 */}
      <section className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold">나의 활동</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
        </div>
      </section>

      {/* 최근 활동 - 라이브러리 콘텐츠 뷰 스타일 */}
      <section className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">최근 활동</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/library")}
            aria-label="라이브러리로 이동"
          >
            더보기
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recentActivitiesData.map((activity) => (
            <ContentItem
              key={activity.id}
              item={activity}
              onClick={() => onActivityClick(activity)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
