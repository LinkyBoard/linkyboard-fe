"use client";

import { infoToast } from "@/utils/toast";
import { Button } from "@linkyboard/components";
import { cn } from "@linkyboard/utils";

import { FileText, Lightbulb, Link } from "lucide-react";

const aiInsights = [
  {
    title: "연결 발견",
    description:
      "최근 저장한 'expo + FCM으로 푸시 알람 보내기' 관련 콘텐츠와 'expo 프로젝트 시작하기' 토픽 간의 흥미로운 연결점을 발견했습니다.",
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
    description: "지난 주에 수집한 2개의 콘텐츠를 바탕으로 주간 학습 요약을 생성했습니다.",
    buttonText: "요약 보기",
    gradient: "from-orange-500 to-red-600",
    icon: FileText,
  },
];

export default function AiInsight() {
  const onInsightClick = () => {
    infoToast("아직 준비    중 이에요.");
  };
  return (
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
              <div className="line-clamp-1 text-lg font-semibold">{insight.title}</div>
            </div>
            <p className="mb-4 line-clamp-2 leading-relaxed opacity-90">{insight.description}</p>
            <Button
              variant="white"
              size="sm"
              className="transform shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              onClick={onInsightClick}
            >
              {insight.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
