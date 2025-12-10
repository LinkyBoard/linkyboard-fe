"use client";

import { useRouter } from "next/navigation";

import { Button } from "@linkyboard/components";

import RadialRing from "./radial-ring";
import Image from "../common/image";

const steps = [
  {
    number: "1",
    title: "정보 수집",
    description: "Chrome 확장프로그램으로 웹페이지, PDF, 노트를 한 곳에 저장하세요",
  },
  {
    number: "2",
    title: "AI 요약 & 정리",
    description: "AI가 자동으로 내용을 요약하고 태그를 추출해 정리해드립니다",
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

const gradientBg = "/static/gradient-bg.webp";

export default function FourStepsSection() {
  const router = useRouter();

  return (
    <section id="how-it-works" className="relative overflow-hidden py-20">
      <Image src={gradientBg} alt="gradient-bg" fill className="object-cover" />
      <div className="relative z-10 flex flex-col items-center gap-12 px-4">
        <h2 className="text-center text-[42px] font-bold text-white">
          이제 쌓아두지 말고
          <br />
          링키보드 4단계로 정리하세요
        </h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="space-y-4 text-center text-white">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full border-4 border-white font-bold">
                {step.number}
              </div>
              <fieldset className="bg-white/13 rounded-xl border-4 p-7">
                <legend className="text-nowrap px-10 text-xl font-semibold">{step.title}</legend>
                <p>{step.description}</p>
              </fieldset>
            </div>
          ))}
        </div>
        <Button
          size="lg"
          variant="white"
          onClick={() => router.push("/login")}
          aria-label="무료로 시작하기"
        >
          <span className="bg-gradient-to-r from-[#751698] to-[#13B5E8] bg-clip-text text-transparent">
            무료로 시작하기
          </span>
        </Button>
      </div>
      <RadialRing size={729} ringGap={25} className="opacity-7 absolute bottom-10 left-[380px]" />
      <RadialRing size={567} ringGap={21} className="opacity-7 absolute right-[303px] top-40" />
    </section>
  );
}
