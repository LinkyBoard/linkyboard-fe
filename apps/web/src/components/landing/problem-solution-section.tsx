import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";

import { AlertTriangle, Clock, Puzzle } from "lucide-react";

const problemCards = [
  {
    icon: AlertTriangle,
    title: "정보 과부하",
    description: "매일 쏟아지는 수많은 정보에 압도되어 중요한 내용을 놓치고 있나요?",
  },
  {
    icon: Puzzle,
    title: "흩어진 정보",
    description: "웹페이지, PDF, 노트가 각각 다른 곳에 저장되어 찾기 어려운 상황인가요?",
  },
  {
    icon: Clock,
    title: "시간 낭비",
    description: "정보를 정리하고 연결하는 데 너무 많은 시간을 소모하고 있나요?",
  },
];

export default function ProblemSolutionSection() {
  return (
    <section id="introduction" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            정보 과부하로 <br className="sm:hidden" /> 지치셨나요?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            현대인의 가장 큰 고민, 효율적인 지식 관리의 해답을 제시합니다
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {problemCards.map((card, index) => (
            <Card key={index} className="text-center transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <card.icon className="text-destructive mx-auto mb-4 h-12 w-12" aria-hidden="true" />
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="from-primary to-chart-2 border-0 bg-gradient-to-r text-white">
          <CardContent className="p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold">LinkyBoard로 모든 문제를 해결하세요!</h3>
            <p className="text-lg opacity-90">
              AI 기반 스마트 요약과 시각적 지식 연결로 효율적인 학습과 창의적 사고를 경험하세요
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
