"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { removeCookie } from "@/utils/cookie";
import { Button, infoToast } from "@linkyboard/components";
import { useOutsideClick } from "@linkyboard/hooks";

import { Bell, Bot, LogOut, User } from "lucide-react";

import SearchHeader from "../../common/search-header";

export default function DashboardHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const [userMenuRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsUserMenuOpen(false);
  });

  const onInsightClick = () => {
    infoToast("아직 준비 중 이에요.");
  };

  const onActionClick = () => {
    infoToast("아직 준비 중 이에요.");
  };

  const onLogout = () => {
    // 쿠키 삭제
    removeCookie("accessToken");
    removeCookie("refreshToken");
    removeCookie("loggedIn");

    // 로그인 페이지로 리다이렉트
    router.push("/login");
  };

  const onUserButtonClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="border-border mb-8 flex items-center justify-between border-b pb-4">
      <SearchHeader placeholder="콘텐츠를 검색하세요" />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onInsightClick} aria-label="AI 어시스턴트">
          <Bot size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onActionClick} aria-label="알림">
          <Bell size={20} />
        </Button>
        <div className="relative" ref={userMenuRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onUserButtonClick}
            aria-label="사용자 메뉴"
            aria-expanded={isUserMenuOpen}
          >
            <User size={20} />
          </Button>
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-md border bg-white shadow-lg">
              <button
                onClick={onLogout}
                className="hover:bg-primary/10 flex w-full items-center gap-3 px-4 py-2 text-left text-sm"
                aria-label="로그아웃"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
