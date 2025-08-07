import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useReplaceNavigate } from "@/hooks/use-replace-navigate";
import { useTabStore } from "@/lib/zustand/tab";
import { useUserStore } from "@/lib/zustand/user";
import { extractMetaContent, getHtmlText } from "@/utils/chrome";
import { errorToast } from "@/utils/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  useDialog,
} from "@repo/ui/components/dialog";

import { LogOut, Save, Sparkles } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function LogoutDialogContent() {
  const { close } = useDialog();
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  const navigate = useReplaceNavigate();

  const onLogout = () => {
    chrome.cookies.remove({
      url: baseUrl,
      name: "accessToken",
    });
    chrome.cookies.remove({
      url: baseUrl,
      name: "refreshToken",
    });
    setIsLoggedIn(false);
    navigate("/");
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
  const { currentTab, isFindingExistPath } = useTabStore();
  const navigate = useReplaceNavigate();

  // 실제 구현에서는 Chrome API를 통해 현재 탭 정보를 가져올 예정
  const currentTabInfo = {
    url: "https://example.com/article/interesting-content",
    title: "흥미로운 기술 아티클 - 최신 개발 트렌드 분석",
  };

  const saveDisabledd = isFindingExistPath || isLoading;

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

  const onSaveWithSummary = async () => {
    try {
      const html = await getHtmlText();
      const htmlContent = html.split("------MultipartBoundary--")[1];

      if (!htmlContent) {
        return errorToast("잘못된 페이지에요. 다시 시도해주세요.");
      }

      // Meta 태그에서 image 추출
      const ogImage = extractMetaContent(htmlContent, "og:image");

      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      const htmlFile = new File([htmlBlob], "content.html", { type: "text/html" });

      const formData = new FormData();
      formData.append("htmlFile", htmlFile);

      // await mutateAsync({
      //   title: currentTab.title,
      //   siteUrl: currentTab.url,
      //   htmlFile: formData,
      // });
      navigate("/create-content");
    } catch (error) {
      console.error("저장 실패:", error);
    } finally {
      setIsLoading(false);
    }
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
        <div className="mb-3 overflow-hidden">
          <p className="text-muted-foreground mb-1 text-xs font-medium">URL</p>
          <p className="text-foreground bg-muted/50 truncate rounded p-2 text-sm">
            {currentTab.url}
          </p>
        </div>

        {/* 제목 */}
        <div className="overflow-hidden">
          <p className="text-muted-foreground mb-1 text-xs font-medium">제목</p>
          <p className="text-foreground bg-muted/50 truncate rounded p-2 text-sm">
            {currentTab.title}
          </p>
        </div>
      </div>

      {/* 저장 옵션 */}
      <div className="space-y-4">
        <h3 className="text-foreground text-base font-semibold">저장 옵션</h3>

        {/* 저장만 하기 */}
        <Button
          onClick={onSaveOnly}
          disabled={saveDisabledd}
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
          disabled={saveDisabledd}
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
