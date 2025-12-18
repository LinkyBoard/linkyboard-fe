"use client";

import { useRouter } from "next/navigation";

import { Button } from "@linkyboard/components";

import { Download } from "lucide-react";

import Image from "../common/image";

const landingBg = "/static/landing-bg.webp";

export default function HeroSection() {
  const router = useRouter();

  const onDownloadClick = () => {
    // 실제 구현에서는 다운로드 링크로 이동
    window.open(
      "https://chromewebstore.google.com/detail/linkyboard/bbldallbjgpapnnholammeccaieoaigd?authuser=0&hl=ko",
      "_blank"
    );
  };

  return (
    <section className="aspect-9/5 relative z-10 flex items-center py-24 text-center">
      <Image src={landingBg} alt="landing-bg" fill className="-z-10 object-cover" />
      <div className="bg-glass z-10 mx-auto w-4/5 max-w-[1047px] space-y-7 px-4 py-20">
        <h1 className="animate-fade-in-up text-4xl font-semibold text-white md:text-6xl">
          쌓기만 하던 자료
          <br />
          간편하게 정리·요약까지
        </h1>

        <p className="animate-fade-in-up mx-auto text-xl text-white md:text-2xl">
          흩어진 정보를 연결된 인사이트로 변환하는
          <br />
          브라우저 통합 지식 관리 서비스
        </p>

        <div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="flex items-center gap-2"
            // onClick={() => router.push("/login")}
            aria-label="무료로 시작하기"
          >
            {/* 무료로 시작하기 */}
            <a href="https://forms.gle/R1KR3mnbWg5Hnaen7" target="_blank" rel="noopener noreferrer">
              사전 등록하기
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onDownloadClick}
            className="flex flex-wrap items-center gap-1"
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
