import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { LogOut, Save, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  useDialog,
} from "@repo/ui/components/dialog";

function LogoutDialogContent() {
  const { close } = useDialog();

  const onLogout = async () => {
    // 로그아웃 성공 시 모달 닫기
    console.log("로그아웃");
    close();
  };

  return (
    <DialogContent>
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-lg font-semibold">로그아웃</h2>
          <p className="text-muted-foreground text-sm">정말 로그아웃 하시겠습니까?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <DialogClose>취소</DialogClose>
          </Button>
          <Button onClick={onLogout}>로그아웃</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function SearchContent() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // 실제 구현에서는 Chrome API를 통해 현재 탭 정보를 가져올 예정
  const currentTabInfo = {
    url: "https://example.com/article/interesting-content",
    title: "흥미로운 기술 아티클 - 최신 개발 트렌드 분석",
  };

  const onSaveOnly = async () => {
    setIsLoading(true);
    try {
      console.log("저장만 하기:", currentTabInfo);
    } catch (error) {
      console.error("저장 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSaveWithSummary = () => {
    navigate("/create-content");
  };

  return (
    <div className="bg-background min-h-screen p-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-foreground text-xl font-bold">북마크 저장</h1>
        <Dialog>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="로그아웃"
            asChild
          >
            <DialogTrigger>
              <LogOut className="h-4 w-4" />
            </DialogTrigger>
          </Button>
          <LogoutDialogContent />
        </Dialog>
      </div>

      {/* 현재 탭 정보 */}
      <div className="bg-card mb-8 rounded-xl border p-6 shadow-sm">
        <h2 className="text-foreground mb-4 text-lg font-semibold">현재 페이지</h2>

        {/* URL */}
        <div className="mb-3">
          <p className="text-muted-foreground mb-1 text-xs font-medium">URL</p>
          <p className="text-foreground bg-muted/50 line-clamp-1 rounded p-2 text-sm break-all">
            {currentTabInfo.url}
          </p>
        </div>

        {/* 제목 */}
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium">제목</p>
          <p className="text-foreground bg-muted/50 line-clamp-1 rounded p-2 text-sm break-all">
            {currentTabInfo.title}
          </p>
        </div>
      </div>

      {/* 저장 옵션 */}
      <div className="space-y-4">
        <h3 className="text-foreground text-base font-semibold">저장 옵션</h3>

        {/* 저장만 하기 */}
        <Button
          onClick={onSaveOnly}
          disabled={isLoading}
          variant="outline"
          size="lg"
          className="w-full justify-start"
          aria-label="저장만 하기"
        >
          <div className="flex items-center space-x-3">
            <Save className="text-muted-foreground size-5" />
            <div className="text-left">
              <p className="font-medium">빠른 저장</p>
              <p className="text-muted-foreground text-xs">URL과 제목만 저장합니다</p>
            </div>
          </div>
        </Button>

        {/* 요약과 함께 저장하기 */}
        <Button
          onClick={onSaveWithSummary}
          disabled={isLoading}
          size="lg"
          className="w-full justify-start"
          aria-label="요약과 함께 저장하기"
        >
          <div className="flex items-center space-x-3">
            <Sparkles className="size-5" />
            <div className="text-left">
              <p className="font-medium">상세 저장</p>
              <p className="text-primary-foreground/80 text-xs">메모와 함께 저장합니다</p>
            </div>
          </div>
        </Button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">저장 중...</p>
        </div>
      )}
    </div>
  );
}
