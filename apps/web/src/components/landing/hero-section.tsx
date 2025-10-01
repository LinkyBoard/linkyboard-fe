"use client";

import { useRouter } from "next/navigation";

import { Button } from "@linkyboard/components";

import { Download } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  const onDownloadClick = () => {
    // 실제 구현에서는 다운로드 링크로 이동
    window.open(
      "https://chromewebstore.google.com/detail/%EB%84%A4%EB%B7%B8%EB%9D%BC-%ED%81%AC%EB%A1%AC-%EC%9D%B5%EC%8A%A4%ED%85%90%EC%85%98/edkjbjnfoipbcbhjckkfmlccokffdgcn?authuser=0&hl=ko",
      "_blank"
    );
  };

  return (
    <section className="from-background to-accent bg-gradient-to-br py-24 text-center">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="from-primary to-chart-2 animate-fade-in-up mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
          지식 관리의
          <br />
          <span className="text-primary">새로운 패러다임</span>
        </h1>

        <p className="text-muted-foreground animate-fade-in-up mx-auto mb-8 max-w-3xl text-xl md:text-2xl">
          흩어진 정보를 연결된 인사이트로 변환하는
          <br />
          브라우저 통합 지식 관리 서비스
        </p>

        <div className="animate-fade-in-up mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="flex items-center gap-2"
            onClick={() => router.push("/login")}
            aria-label="무료로 시작하기"
          >
            무료로 시작하기
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onDownloadClick}
            className="flex items-center gap-1"
            aria-label="기능 살펴보기"
          >
            <Download size={20} />
            Chrome 확장프로그램 다운로드
          </Button>
        </div>
      </div>
    </section>
  );
}
