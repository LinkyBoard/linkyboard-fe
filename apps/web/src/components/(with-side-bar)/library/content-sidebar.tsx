"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ResizeBar from "@/components/common/resize-bar";
import { CATEGORY } from "@/constants/category";
import { CONTENT } from "@/constants/content";
import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useRemoveContentById, useUpdateContent } from "@/lib/tanstack/mutation/content";
import { useGetCategories } from "@/lib/tanstack/query/category";
import { useGetContentById } from "@/lib/tanstack/query/content";
import { useContentSidebarStore } from "@/lib/zustand/content-sidebar";
import { useDashboardStore } from "@/lib/zustand/dashboard";
import type { ContentDetailDTO } from "@/models/content";
import { contentSchema, type ContentSchemaType } from "@/schemas/content";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogTrigger, errorToast } from "@linkyboard/components";
import { useOutsideClick } from "@linkyboard/hooks";
import { cn } from "@linkyboard/utils";

import { AlertCircle, Edit, Loader2, Save, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";

import ContentEditMode from "./content-edit-mode";
import ContentWatchMode from "./content-watch-mode";
import RemoveDialogContent from "../topic/remove-dialog-content";

const DEFAULT_CONTENT = {
  title: "",
  summary: "",
  memo: "",
  tags: [],
  category: "",
};

const MIN_WIDTH = 448;
const MAX_WIDTH = 576;

export default function ContentSidebar() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [categoryId] = currentCategory?.split(",") || [];

  const [sidebarWidth, setSidebarWidth] = useState(448);

  const [sidebarRef] = useOutsideClick<HTMLDivElement>(() => {
    if (isOpen) {
      onSidebarClose();
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { isOpen, onClose, selectedContentId } = useContentSidebarStore();
  const { data, isLoading, isError } = useGetContentById(selectedContentId);
  const { data: categories, isPending: isCategoriesPending } = useGetCategories();
  const { mutateAsync: removeContent, isPending: isDeletePending } = useRemoveContentById();
  const { mutateAsync: updateContent, isPending: isUpdatePending } = useUpdateContent();

  const setTotalLibraries = useDashboardStore((state) => state.setTotalLibraries);

  const form = useForm<ContentSchemaType>({
    resolver: zodResolver(contentSchema),
    defaultValues: DEFAULT_CONTENT,
  });

  const buttonDisabled = isLoading || isError || isDeletePending;

  const onSave = form.handleSubmit(async (submitData) => {
    if (submitData && selectedContentId) {
      const body = {
        ...data,
        ...submitData,
      } as ContentDetailDTO;

      await updateContent(body, {
        onSuccess: () => {
          setIsEditing(false);
          invalidateQueries([CONTENT.GET_CONTENT_BY_ID, selectedContentId]);
          invalidateQueries([CONTENT.GET_CATEGORY_CONTENT_BY_ID, categoryId]);
          invalidateQueries([CATEGORY.GET_CATEGORIES]);
          invalidateQueries([TOPIC.GET_ALL_CONTENTS]);
          invalidateQueries([TOPIC.GET_TOPIC_BOARD_BY_ID]);
        },
      });
    }
  });

  const onSidebarClose = () => {
    if (!isDeleteModalOpen) {
      setIsEditing(false);
      onClose();
    }
  };

  const onCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const onDelete = async () => {
    if (!selectedContentId) return errorToast("잘못된 요청이에요.");
    await removeContent(selectedContentId, {
      onSuccess: () => {
        onClose();
        invalidateQueries([CONTENT.GET_CONTENT_BY_ID, selectedContentId]);
        invalidateQueries([CONTENT.GET_CATEGORY_CONTENT_BY_ID, categoryId]);
        invalidateQueries([CATEGORY.GET_CATEGORIES]);
        invalidateQueries([TOPIC.GET_ALL_CONTENTS]);
        invalidateQueries([TOPIC.GET_TOPIC_BOARD_BY_ID]);
      },
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    const newWidth = window.innerWidth - e.clientX;

    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setSidebarWidth(newWidth);
    }
  };

  useEffect(() => {
    if (!isCategoriesPending) {
      const totalLibraries = categories?.reduce((acc, category) => acc + category.contentCount, 0);
      setTotalLibraries(totalLibraries || 0);
    }
  }, [isCategoriesPending]);

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50",
        isOpen && "pointer-events-auto bg-black/50"
      )}
      aria-label="사이드바 닫기"
    >
      <div
        ref={sidebarRef}
        className={cn(
          "fixed right-0 top-0 z-50 h-full bg-white shadow-xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-xl font-semibold">{isEditing ? "콘텐츠 편집" : "콘텐츠 상세"}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="사이드바 닫기">
              <X size={24} />
            </Button>
          </div>

          {/* 내용 */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin" />
                <p className="text-base">콘텐츠 정보를 가져오고 있어요</p>
              </div>
            ) : isError ? (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <AlertCircle className="text-destructive size-8" />
                <p className="text-base">콘텐츠 정보를 가져오는데 실패했어요</p>
              </div>
            ) : isEditing ? (
              // 편집 모드
              <ContentEditMode form={form} categories={categories || []} />
            ) : data ? (
              // 보기 모드
              <ContentWatchMode {...data} />
            ) : null}
          </div>

          {/* 액션 버튼 */}
          <div className="border-t p-6">
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  onClick={onSave}
                  className="h-12 flex-1 text-base"
                  disabled={isUpdatePending}
                >
                  <Save size={18} className="mr-2" />
                  저장
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="h-12 text-base"
                  disabled={isUpdatePending}
                >
                  취소
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="h-12 flex-1 text-base"
                  disabled={buttonDisabled}
                >
                  <Edit size={18} className="mr-2" />
                  편집
                </Button>
                <Dialog>
                  <Button
                    className="h-12 bg-red-400 text-base hover:bg-red-500"
                    asChild
                    disabled={buttonDisabled}
                  >
                    <DialogTrigger>
                      <Trash2 size={18} className="mr-2" />
                      삭제
                    </DialogTrigger>
                  </Button>
                  <RemoveDialogContent
                    id={selectedContentId}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    onDelete={onDelete}
                  />
                </Dialog>
              </div>
            )}
          </div>
        </div>
        <ResizeBar className="absolute left-0 top-0 h-full" onMouseMove={onMouseMove} />
      </div>
    </div>
  );
}
