"use client";

import dynamic from "next/dynamic";

interface TopicDetailPageProps {
  id: string;
}

const BlockNote = dynamic(() => import("@/components/block-note"), { ssr: false });

export default function TopicDetailPage({ id }: TopicDetailPageProps) {
  return (
    <main className="flex h-full flex-col gap-4">
      <input
        className="border-border w-full border-b pb-3 text-3xl font-bold outline-none"
        placeholder="제목을 입력해주세요"
      />
      <BlockNote />
    </main>
  );
}
