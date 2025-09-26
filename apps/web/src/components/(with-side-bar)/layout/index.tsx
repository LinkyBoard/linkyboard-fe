"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Logo from "@/assets/logo.svg";
import SentinelSpinner from "@/components/sentinel-spinner";
import { useGetAllTopics } from "@/lib/tanstack/query/topic";
import { useDashboardStore } from "@/lib/zustand/dashboard-store";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import type { TopicDTO } from "@/models/topic";
import { cn } from "@linkyboard/utils";

import type { LucideIcon } from "lucide-react";
import { Book, Grid3X3, Home, Loader2 } from "lucide-react";

import RecentTopicItem from "./recent-topic-item";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: "대시보드", href: "/dashboard" },
  { icon: Book, label: "라이브러리", href: "/library" },
  { icon: Grid3X3, label: "토픽 보드", href: "/topic" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isOpen, close } = useMobileMenuStore();
  const setTotalTopics = useDashboardStore((state) => state.setTotalTopics);

  // 현재 선택된 토픽 ID 가져오기
  const currentTopicId = Number(searchParams.get("id") || "");

  const {
    data: recentTopics,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useGetAllTopics();

  const onTopicClick = (topic: TopicDTO) => {
    router.push(`/topic?id=${topic.id}`);
    close(); // 모바일에서 사이드바 닫기
  };

  useEffect(() => {
    if (!isPending) {
      setTotalTopics(recentTopics?.data?.length || 0);
    }
  }, [isPending]);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-sidebar-border fixed z-50 h-screen w-70 overflow-y-auto border-r p-6 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-0 lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="border-sidebar-border mb-8 flex items-center gap-3 border-b pb-4"
        >
          <Logo className="size-10" />
          <div className="text-primary text-2xl font-bold">LinkyBoard</div>
        </Link>

        {/* Navigation */}
        <nav className="mb-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "mb-2 flex items-center gap-3 rounded-md px-4 py-3 transition-all duration-300",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={close}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Recent Topics */}
        <div className="mt-8">
          <div className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
            나의 토픽
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : !recentTopics || recentTopics?.data?.length === 0 ? (
            <p className="text-muted-foreground text-sm">토픽이 없어요.</p>
          ) : (
            recentTopics?.data?.map((topic) => (
              <RecentTopicItem
                key={topic.id}
                isSelected={currentTopicId === topic.id}
                topic={topic}
                onTopicClick={() => onTopicClick(topic)}
              />
            ))
          )}
          <SentinelSpinner
            className="mx-auto"
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />}
    </>
  );
}
