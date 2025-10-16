import { CATEGORY } from "@/constants/category";
import { TAG } from "@/constants/tag";
import { useReplaceNavigate } from "@/hooks/use-replace-navigate";
import { queryClient } from "@/lib/tanstack";
import { useTabStore } from "@/lib/zustand/tab";
import { useUserStore } from "@/lib/zustand/user";
import { getCategories } from "@/services/category";
import { getTags } from "@/services/tag";
import { extractMetaContent, getHtmlText } from "@/utils/chrome";
import { removeCookie } from "@/utils/cookie";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  errorToast,
  promisedToast,
  useDialog,
} from "@linkyboard/components";

import { Globe, LogOut, Save, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useDetailSaveContent,
  useDetailSaveYoutubeContent,
  useQuickSaveContent,
  useQuickSaveYoutubeContent,
} from "../lib/tanstack/mutation/content";

const createHtmlFile = (htmlContent: string) => {
  const htmlBlob = new Blob([htmlContent], { type: "text/html" });
  return new File([htmlBlob], "content.html", { type: "text/html" });
};

// 현재 탭의 HTML과 썸네일 메타 정보를 읽어 저장에 필요한 파일과 데이터를 만든다.
const getHtmlPayload = async () => {
  const html = await getHtmlText();
  const htmlContent = html.split("------MultipartBoundary--")[1];

  if (!htmlContent) {
    errorToast("잘못된 페이지에요. 다시 시도해주세요.");
    return null;
  }

  const thumbnail = extractMetaContent(htmlContent, "og:image");

  if (!thumbnail) {
    errorToast("썸네일 추출 중 오류가 발생했어요. 다시 시도해주세요.");
    return null;
  }

  return {
    htmlFile: createHtmlFile(htmlContent),
    thumbnail,
  };
};

function LogoutDialogContent() {
  const { close } = useDialog();
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  const navigate = useReplaceNavigate();

  const onLogout = () => {
    removeCookie("accessToken");
    removeCookie("refreshToken");

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

// 현재 탭을 빠르게 저장하거나 요약 생성 플로우로 이어주는 북마크 저장 페이지.
export default function SearchContent() {
  const { currentTab, isFindingExistPath } = useTabStore();

  const navigate = useNavigate();

  const { mutateAsync: mutateQuickSaveContent, isPending: isPendingQuickSaveContent } =
    useQuickSaveContent();
  const { mutateAsync: mutateDetailSaveContent, isPending: isPendingDetailSaveContent } =
    useDetailSaveContent();
  const {
    mutateAsync: mutateQuickSaveYoutubeContent,
    isPending: isPendingQuickSaveYoutubeContent,
  } = useQuickSaveYoutubeContent();
  const {
    mutateAsync: mutateDetailSaveYoutubeContent,
    isPending: isPendingDetailSaveYoutubeContent,
  } = useDetailSaveYoutubeContent();

  const isSaveDisabled =
    isFindingExistPath ||
    isPendingQuickSaveContent ||
    isPendingDetailSaveContent ||
    isPendingQuickSaveYoutubeContent ||
    isPendingDetailSaveYoutubeContent;

  const isYoutubeUrl = currentTab.url.includes("youtube.com");

  const onSaveOnly = async () => {
    if (isYoutubeUrl) {
      await mutateQuickSaveYoutubeContent({
        title: currentTab.title,
        url: currentTab.url,
      });
    } else {
      const payload = await getHtmlPayload();
      if (!payload) return;

      const { htmlFile, thumbnail } = payload;
      const formData = new FormData();

      formData.append("htmlFile", htmlFile);
      formData.append("title", currentTab.title);
      formData.append("url", currentTab.url);
      formData.append("thumbnail", thumbnail);

      const promise = mutateQuickSaveContent(formData);
      promisedToast(promise, {
        loading: "저장 중...",
        success: "저장에 성공했어요.",
        error: "저장에 실패했어요.",
      });
    }
  };

  const onSaveWithSummary = async () => {
    if (isYoutubeUrl) {
      const promise = mutateDetailSaveYoutubeContent(
        {
          url: currentTab.url,
        },
        {
          onSuccess: (data) => {
            queryClient.prefetchQuery({
              queryKey: [TAG.GET_TAGS],
              queryFn: getTags,
              staleTime: 1000 * 60,
            });
            queryClient.prefetchQuery({
              queryKey: [CATEGORY.GET_CATEGORIES],
              queryFn: getCategories,
              staleTime: 1000 * 60,
            });
            navigate("/create-content", {
              state: {
                ...data.result,
                ...currentTab,
                thumbnail: "",
                transcript: "",
              },
            });
          },
        }
      );

      promisedToast(promise, {
        loading: "유튜브 요약 중...",
        success: "요약에 성공했어요.",
        error: "요약에 실패했어요.",
      });
      return;
    }

    const payload = await getHtmlPayload();
    if (!payload) return;

    const { htmlFile, thumbnail } = payload;
    const formData = new FormData();
    formData.append("htmlFile", htmlFile);

    const promise = mutateDetailSaveContent(
      {
        url: currentTab.url,
        formData,
      },
      {
        onSuccess: (data) => {
          queryClient.prefetchQuery({
            queryKey: [TAG.GET_TAGS],
            queryFn: getTags,
            staleTime: 1000 * 60,
          });
          queryClient.prefetchQuery({
            queryKey: [CATEGORY.GET_CATEGORIES],
            queryFn: getCategories,
            staleTime: 1000 * 60,
          });
          navigate("/create-content", {
            state: {
              ...data.result,
              ...currentTab,
              thumbnail,
              htmlFile,
            },
          });
        },
      }
    );
    promisedToast(promise, {
      loading: "페이지 요약 중...",
      success: "요약에 성공했어요.",
      error: "요약에 실패했어요.",
    });
  };

  return (
    <>
      {/* 헤더 */}
      <header className="bg-background sticky top-0 z-10 flex items-center justify-between p-6 shadow">
        <h1 className="text-foreground text-xl font-bold">북마크 저장</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="웹 페이지로 이동"
            onClick={() => window.open("https://www.linkyboard.com", "_blank")}
          >
            <Globe className="h-4 w-4" />
          </Button>
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
        <div className="space-y-2">
          <h3 className="text-foreground text-base font-semibold">저장 옵션</h3>

          {/* 저장만 하기 */}
          <Button
            onClick={onSaveOnly}
            disabled={isSaveDisabled}
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
            disabled={isSaveDisabled}
            size="lg"
            className="w-full justify-start"
            aria-label="요약과 함께 저장하기"
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="size-5" />
              <div className="text-left">
                <p className="font-medium">
                  {isPendingDetailSaveContent ? "페이지 요약 중..." : "상세 저장"}
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
