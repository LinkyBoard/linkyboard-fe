"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@repo/ui/utils/cn";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import { type Topic, useTopicStore } from "@/lib/zustand/topic-store";

import { Book, Grid3X3, Home, LucideIcon } from "lucide-react";

import AddTopicModal from "./add-topic-modal";
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
  const topicStore = useTopicStore();

  // 현재 선택된 토픽 ID 가져오기
  const currentTopicId = Number(searchParams.get("id") || "");

  // 최근 토픽 가져오기
  const recentTopics = topicStore.getRecentTopics();

  const onTopicClick = (topic: Topic) => {
    router.push(`/topic?id=${topic.id}`);
    close(); // 모바일에서 사이드바 닫기
  };

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        topicStore.setShowNewTopicModal(false);
      }
    };

    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, []);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-sidebar-border fixed z-50 h-screen w-70 overflow-y-auto border-r p-6 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="border-sidebar-border mb-8 flex items-center gap-3 border-b pb-4"
        >
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-md text-xl font-bold text-white">
            N
          </div>
          <div className="text-primary text-2xl font-bold">NEBULA</div>
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
            최근 토픽
          </div>
          {recentTopics.map((topic) => (
            <RecentTopicItem
              key={topic.id}
              isSelected={currentTopicId === topic.id}
              topic={topic}
              onTopicClick={() => onTopicClick(topic)}
            />
          ))}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />}

      <AddTopicModal />
    </>
  );
}
