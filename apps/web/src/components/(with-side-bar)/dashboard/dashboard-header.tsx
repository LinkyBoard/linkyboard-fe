"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import { removeCookie } from "@/utils/cookie";
import { Button, infoToast, Input } from "@linkyboard/components";
import { useOutsideClick } from "@linkyboard/hooks";

import { Bell, Bot, LogOut, Menu, Search, User } from "lucide-react";

export default function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const { toggle } = useMobileMenuStore();
  const [userMenuRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsUserMenuOpen(false);
  });

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onInsightClick = () => {
    infoToast("아직 준비 중 이에요.");
  };

  const onActionClick = () => {
    infoToast("아직 준비 중 이에요.");
  };

  const onLogout = async () => {
    try {
      // 쿠키 삭제
      await removeCookie("accessToken");
      await removeCookie("refreshToken");
      await removeCookie("loggedIn");

      // 로그인 페이지로 리다이렉트
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  const onUserButtonClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="border-border mb-8 flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggle}
          aria-label="메뉴 토글"
        >
          <Menu size={24} />
        </Button>
        <div className="relative w-96">
          <Search
            className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transform"
            size={20}
          />
          {/* 검색 결과 네이버 검색 참고하기 */}
          <Input
            type="text"
            placeholder="콘텐츠를 검색하세요"
            className="pl-10"
            value={searchQuery}
            onChange={onSearchChange}
            aria-label="콘텐츠 검색"
          />
        </div>
      </div>
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
