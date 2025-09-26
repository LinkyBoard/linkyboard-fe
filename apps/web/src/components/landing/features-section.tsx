import { Card, CardContent, CardHeader, CardTitle } from "@linkyboard/components";

import { Bot, Chrome, Lightbulb, Network, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: Chrome,
    title: "Chrome 확장프로그램",
    description: "웹페이지 정보 수집, AI/사용자 요약, 노트 작성, 태그 저장을 한 번에 처리하세요",
  },
  {
    icon: Bot,
    title: "AI 기반 스마트 관리",
    description: "AI 요약과 추천 기능으로 시간을 절약하고 효율성을 극대화하세요",
  },
  {
    icon: Network,
    title: "폴더 뷰 시각화",
    description: "태그 중심의 시각적 클러스터링과 필터링으로 지식의 연결을 한눈에 파악하세요",
  },
  {
    icon: Lightbulb,
    title: "토픽 생성 및 지식 보드",
    description:
      "유연한 지식 배치와 연결로 개인만의 지식 보드를 만들어 창의적 인사이트를 생성하세요",
  },
  {
    icon: Users,
    title: "통합 지식 관리",
    description: "검색 결과와 다양한 지식 소스를 한 곳에서 편리하게 관리하세요",
  },
  {
    icon: TrendingUp,
    title: "인사이트 분석",
    description: "지식 간의 연결을 분석하여 새로운 아이디어와 통찰력을 발견하세요",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-card py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">강력한 기능들</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            지식 관리를 혁신적으로 바꿔주는 핵심 기능들을 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg"
            >
              <CardHeader>
                <feature.icon
                  className="text-primary mb-4 h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
