import { useEffect, useMemo } from "react";

import Logo from "@/assets/logo.svg?react";
import SelectCategory from "@/components/create-content/select-category";
import SelectTag from "@/components/create-content/select-tag";
import { CONTENT } from "@/constants/content";
import { useReplaceNavigate } from "@/hooks/use-replace-navigate";
import { invalidateQueries } from "@/lib/tanstack";
import {
  useFinishDetailSaveContent,
  useFinishDetailSaveYoutubeContent,
  useUpdateContent,
} from "@/lib/tanstack/mutation/content";
import { useGetContentById } from "@/lib/tanstack/query/content";
import { contentSchema, type ContentSchemaType } from "@/schemas/content";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, successToast } from "@linkyboard/components";

import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";

interface CreateContentState {
  thumbnail: string;
  title: string;
  url: string;
  summary: string;
  memo: string;
  tags: string[];
  category: string;
  htmlFile: File;
}

const DEFAULT_STATE: CreateContentState = {
  thumbnail: "",
  title: "",
  url: "",
  summary: "",
  memo: "",
  tags: [],
  category: "",
  htmlFile: new File([], ""),
};

export default function CreateContent() {
  const { state } = useLocation() as { state: CreateContentState };
  const [searchParams] = useSearchParams();
  // id가 있다면 수정 모드
  const id = searchParams.get("id");

  const { data: content, isLoading, isRefetching } = useGetContentById(id);

  const navigate = useReplaceNavigate();

  const {
    mutateAsync: mutateFinishDetailSaveContent,
    isPending: isPendingFinishDetailSaveContent,
  } = useFinishDetailSaveContent();
  const {
    mutateAsync: mutateFinishDetailSaveYoutubeContent,
    isPending: isPendingFinishDetailSaveYoutubeContent,
  } = useFinishDetailSaveYoutubeContent();
  const { mutateAsync: mutateUpdateContent, isPending: isPendingUpdateContent } =
    useUpdateContent();

  const isBadRequest = !id && !state;
  const title = id ? "콘텐츠 수정" : "상세 저장";

  // 기본값을 미리 계산
  const defaultValues = useMemo(() => {
    if (isBadRequest || isLoading) {
      return { ...DEFAULT_STATE, memo: "" };
    }

    if (id && !isLoading && content?.result) {
      return content.result;
    }

    return { ...state, memo: "" };
  }, [isLoading, content]);

  const form = useForm<ContentSchemaType>({
    resolver: zodResolver(contentSchema),
    defaultValues,
  });

  // defaultValues가 변경될 때 폼 값 업데이트
  useEffect(() => {
    if (!isLoading && !isRefetching) {
      form.reset(defaultValues);
    }
  }, [isLoading, isRefetching]);

  // state가 없으면 리다이렉트
  if (isBadRequest) {
    return <Navigate to="/bad-request" replace />;
  }

  const watchedThumbnail = form.watch("thumbnail");

  const isYoutubeUrl = form.watch("url").includes("youtube.com");
  const isPending =
    isPendingFinishDetailSaveContent ||
    isPendingFinishDetailSaveYoutubeContent ||
    isPendingUpdateContent;

  const onGoBack = () => {
    navigate("/search-content");
  };

  const onSave = form.handleSubmit(async (data) => {
    // 기존 콘텐츠 수정
    if (id) {
      await mutateUpdateContent(
        {
          id: id as string,
          ...data,
          thumbnail: data.thumbnail || "",
          summary: data.summary || "",
          memo: data.memo || "",
        },
        {
          onSuccess: () => {
            successToast("저장에 성공했어요.");
            navigate("/search-content");
            invalidateQueries([CONTENT.GET_CONTENT_BY_ID, id]);
          },
        }
      );
      return;
    }

    // 유튜브 저장
    if (isYoutubeUrl) {
      await mutateFinishDetailSaveYoutubeContent(
        {
          ...data,
          memo: data.memo || "",
          summary: data.summary || "",
          transcript: "",
          thumbnail: data.thumbnail || "",
        },
        {
          onSuccess: () => {
            successToast("저장에 성공했어요.");
            navigate("/search-content");
          },
        }
      );
      return;
    }

    // 웹 페이지 저장
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("url", data.url);
    formData.append("thumbnail", data.thumbnail || "");
    formData.append("memo", data.memo || "");
    formData.append("summary", data.summary || "");
    formData.append("category", data.category);
    for (const tag of data.tags) {
      formData.append("tags", tag);
    }
    formData.append("htmlFile", state.htmlFile);

    await mutateFinishDetailSaveContent(formData, {
      onSuccess: () => {
        successToast("저장에 성공했어요.");
        navigate("/search-content");
      },
    });
  });

  return (
    <>
      {/* 헤더 */}
      <header className="bg-background sticky top-0 z-10 flex items-center justify-between p-6 shadow">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            className="text-muted-foreground hover:text-foreground"
            disabled={isPending}
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-foreground text-xl font-bold">{title}</h1>
        </div>
        <Button onClick={onSave} size="sm" aria-label="저장하기" disabled={isPending}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </header>
      <div className="bg-background p-6">
        <div className="space-y-6">
          {/* 썸네일 */}
          <div>
            <h2 className="text-muted-foreground mb-3 text-sm font-medium">썸네일</h2>
            {watchedThumbnail ? (
              <div className="size-32 overflow-hidden rounded-2xl border">
                <img
                  src={watchedThumbnail}
                  alt="페이지 썸네일"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <Logo className="size-32" />
            )}
          </div>

          {/* URL */}
          <div>
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">URL</h2>
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-foreground line-clamp-1 text-sm">{form.watch("url")}</p>
            </div>
          </div>

          {/* 제목 */}
          <div>
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">제목</h2>
            <Input {...form.register("title")} placeholder="제목을 입력하세요" className="w-full" />
            {form.formState.errors.title && (
              <p className="text-destructive mt-1 text-xs">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* 카테고리 */}
          <SelectCategory category={state?.category || ""} form={form} />

          {/* 태그 */}
          <SelectTag form={form} />

          {/* 요약 */}
          <div>
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">요약</h2>
            <textarea
              {...form.register("summary")}
              placeholder="요약을 입력하세요"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.summary && (
              <p className="text-destructive mt-1 text-xs">
                {form.formState.errors.summary.message}
              </p>
            )}
          </div>

          {/* 메모 */}
          <div>
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">메모</h2>
            <textarea
              {...form.register("memo")}
              placeholder="메모를 입력하세요"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.memo && (
              <p className="text-destructive mt-1 text-xs">{form.formState.errors.memo.message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
