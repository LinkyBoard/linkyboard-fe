"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

const steps = [
  {
    number: "1",
    title: "정보 수집",
    description: "Chrome 확장프로그램으로 웹페이지, PDF, 노트를 한 곳에 저장하세요",
  },
  {
    number: "2",
    title: "AI 요약 & 정리",
    description: "AI가 자동으로 내용을 요약하고 키워드를 추출해 정리해드립니다",
  },
  {
    number: "3",
    title: "시각화 & 연결",
    description: "폴더 뷰로 지식 간의 연결을 시각적으로 확인하고 새로운 관계를 발견하세요",
  },
  {
    number: "4",
    title: "인사이트 도출",
    description: "개인 지식 보드에서 창의적인 아이디어와 통찰력을 생성하세요",
  },
];

export default function HowItWorksSection() {
  const router = useRouter();

  return (
    <section id="how-it-works" className="bg-card py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">사용법은 간단합니다</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            4단계로 시작하는 스마트 지식 관리
          </p>
        </div>

        <div className="my-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="group relative text-center">
              <div className="bg-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-4 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Button
        size="lg"
        className="mx-auto flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
        aria-label="무료로 시작하기"
      >
        무료로 시작하기
      </Button>
    </section>
  );
}
