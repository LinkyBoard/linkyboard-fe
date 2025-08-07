import { Button } from "@repo/ui/components/button";
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
import { useNavigate } from "react-router-dom";

import { useDetailSaveContent, useQuickSaveContent } from "../lib/tanstack/mutation/content";

const getHtmlContent = async () => {
  const html = await getHtmlText();
  const htmlContent = html.split("------MultipartBoundary--")[1];

  if (!htmlContent) {
    errorToast("잘못된 페이지에요. 다시 시도해주세요.");
    return { htmlContent: "", thumbnail: "" };
  }

  const thumbnail = extractMetaContent(htmlContent, "og:image");

  if (thumbnail === null) {
    errorToast("썸네일 추출 중 오류가 발생했어요. 다시 시도해주세요.");
    return { htmlContent: "", thumbnail: "" };
  }

  return { htmlContent, thumbnail };
};

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
  const { currentTab, isFindingExistPath } = useTabStore();

  const navigate = useNavigate();

  const { mutateAsync: mutateQuickSaveContent, isPending: isPendingQuickSaveContent } =
    useQuickSaveContent();
  const { mutateAsync: mutateDetailSaveContent, isPending: isPendingDetailSaveContent } =
    useDetailSaveContent();

  const saveDisabledd =
    isFindingExistPath || isPendingQuickSaveContent || isPendingDetailSaveContent;

  const onSaveOnly = async () => {
    const { htmlContent, thumbnail } = await getHtmlContent();
    if (!htmlContent || !thumbnail) return;

    const htmlBlob = new Blob([htmlContent], { type: "text/html" });
    const htmlFile = new File([htmlBlob], "content.html", { type: "text/html" });

    const formData = new FormData();

    formData.append("htmlFile", htmlFile);
    formData.append("title", currentTab.title);
    formData.append("url", currentTab.url);
    formData.append("thumbnail", thumbnail);

    await mutateQuickSaveContent(formData);
  };

  const onSaveWithSummary = async () => {
    const { htmlContent, thumbnail } = await getHtmlContent();
    if (!htmlContent || !thumbnail) return;

    const htmlBlob = new Blob([htmlContent], { type: "text/html" });
    const htmlFile = new File([htmlBlob], "content.html", { type: "text/html" });

    const formData = new FormData();
    formData.append("htmlFile", htmlFile);

    await mutateDetailSaveContent(
      {
        url: currentTab.url,
        formData,
      },
      {
        onSuccess: (data) => {
          navigate("/create-content", {
            state: { ...data.result, ...currentTab, thumbnail },
          });
        },
      }
    );
  };

  return (
    <>
      {/* 헤더 */}
      <header className="bg-background sticky top-0 z-10 flex items-center justify-between p-6 shadow">
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
      </header>
      <div className="bg-background p-6">
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
                <p className="font-medium">
                  {isPendingQuickSaveContent ? "저장 중..." : "빠른 저장"}
                </p>
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
                <p className="font-medium">
                  {isPendingDetailSaveContent ? "저장 중..." : "상세 저장"}
                </p>
                <p className="text-primary-foreground/80 text-xs">메모와 함께 저장합니다</p>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}
