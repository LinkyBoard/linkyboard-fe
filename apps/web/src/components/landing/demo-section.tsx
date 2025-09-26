"use client";

import { useRouter } from "next/navigation";

import { cn } from "@linkyboard/utils";

import { FolderArchive, Link, NotebookPen } from "lucide-react";

import { Button } from "@linkyboard/components";

const extensionVideo = "/example/extension.mp4";
const dashboardVideo = "/example/dashboard.mp4";
const topicVideo = "/example/topic.mp4";

const DEMO_VIDEOS = [
  {
    type: "extension",
    icon: <NotebookPen size={12} />,
    title: "요약",
    description: "웹 서칭 중 발견한 지식들을 요약하세요.",
    video: extensionVideo,
    button: "Chrome 확장프로그램 다운로드",
  },
  {
    type: "dashboard",
    icon: <FolderArchive size={12} />,
    title: "정리",
    description: "발견한 지식들을 한 곳에서 관리하세요.",
    video: dashboardVideo,
    button: "정리하러 가기",
  },
  {
    type: "topic",
    icon: <Link size={12} />,
    title: "연결",
    description: "지식들을 연결하여 하나의 토픽을 생성하세요.",
    video: topicVideo,
    button: "연결하러 가기",
  },
];

export default function DemoSection() {
  const router = useRouter();

  const onClick = (type: string) => {
    if (type === "extension") {
      return window.open(
        "https://chromewebstore.google.com/detail/%EB%84%A4%EB%B7%B8%EB%9D%BC-%ED%81%AC%EB%A1%AC-%EC%9D%B5%EC%8A%A4%ED%85%90%EC%85%98/edkjbjnfoipbcbhjckkfmlccokffdgcn?authuser=0&hl=ko",
        "_blank"
      );
    }
    if (type === "dashboard") {
      return router.push("/dashboard");
    }
    return router.push("/topic");
  };

  return (
    <section className="bg-card px-4 py-20">
      <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12 lg:space-y-24">
        {DEMO_VIDEOS.map((demo, idx) => (
          <div
            key={demo.title}
            className={cn(
              "animate-fade-in-up flex flex-col items-center gap-6 rounded-2xl lg:flex-row lg:gap-10",
              idx % 2 && "lg:flex-row-reverse"
            )}
          >
            <div className="flex w-full flex-1 flex-col gap-4 lg:w-auto">
              <div className="bg-primary flex w-max items-center gap-2 rounded-full px-2 py-1 text-xs text-white">
                {demo.icon}
                <p className="font-medium">{demo.title}</p>
              </div>
              <p className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                {demo.description}
              </p>
              <Button
                size="lg"
                onClick={() => onClick(demo.type)}
                className="flex w-full items-center justify-center gap-1 sm:w-max"
                aria-label="Chrome 확장프로그램 다운로드"
              >
                {demo.button}
              </Button>
            </div>
            <div className="flex-2 aspect-video w-full lg:w-auto">
              <video
                src={demo.video}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full rounded-xl object-cover shadow-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
