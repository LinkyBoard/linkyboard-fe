"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOPIC } from "@/constants/topic";
import { invalidateMany, invalidateQueries } from "@/lib/tanstack";
import {
  useRemoveCustomSticker,
  useUpdateCustomSticker,
} from "@/lib/tanstack/mutation/custom-sticker";
import { useRemoveTopic, useUpdateTopic } from "@/lib/tanstack/mutation/topic";
import { useStickerStore } from "@/lib/zustand/sticker-store";
import { containsMarkdown, markdownToHtml } from "@/utils/markdown";
import { revalidatePath } from "@/utils/revalidate";
import { errorToast, successToast } from "@/utils/toast";
import { Dialog, DialogTrigger } from "@repo/ui/components/dialog";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Loader2, Save, Trash2, X } from "lucide-react";

import EditTopicTooltipList from "./edit-sticker-tooltip-list";
import RemoveDialogContent from "../remove-dialog-content";

export default function EditTopicSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 토픽 관련 hook
  const { mutateAsync: updateTopic, isPending: isUpdatePending } = useUpdateTopic();
  const { mutateAsync: removeTopic, isPending: isDeletePending } = useRemoveTopic();

  // 스티커 관련 hook
  const { mutateAsync: updateCustomSticker, isPending: isUpdateCustomStickerPending } =
    useUpdateCustomSticker();
  const { mutateAsync: removeCustomSticker, isPending: isDeleteCustomStickerPending } =
    useRemoveCustomSticker();

  const { setEditingSticker, setShowEditStickerSidebar, editingSticker, showEditStickerSidebar } =
    useStickerStore();

  const buttonDisabled =
    isUpdatePending ||
    isDeletePending ||
    isUpdateCustomStickerPending ||
    isDeleteCustomStickerPending;
  const currentType = editingSticker?.type === "custom_sticker" ? "스티커" : "토픽";

  const onClose = () => {
    setEditingSticker(null);
    setShowEditStickerSidebar(false);
  };

  const onClickOutside = () => {
    if (!isDeleteModalOpen) {
      onClose();
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder: "내용을 입력하세요...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
        validate: (href) => /^https?:\/\//.test(href),
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-100 p-4 rounded-md font-mono text-sm",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200",
        },
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_strong]:font-bold [&_em]:italic [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_a]:text-blue-600 [&_a]:underline [&_br]:block [&_br]:h-2",
      },
    },
  });

  useEffect(() => {
    if (editingSticker && editor) {
      setTitle(editingSticker.title);

      // 마크다운이 포함되어 있으면 HTML로 변환
      if (editingSticker.content && containsMarkdown(editingSticker.content)) {
        const htmlContent = markdownToHtml(editingSticker.content);
        editor.commands.setContent(htmlContent);
      } else {
        editor.commands.setContent(editingSticker.content || "");
      }
    }
  }, [editingSticker, editor]);

  const onSave = async () => {
    if (!editingSticker || !editor) return errorToast(`${currentType} 정보가 없어요.`);

    try {
      const content = editor.getHTML();
      // TODO: editingSticker.type에 따라 API 요청 다르게
      if (editingSticker.type === "topic") {
        await updateTopic(
          {
            id: editingSticker.id,
            title,
            content,
          },
          {
            onSuccess: async () => {
              successToast("토픽이 성공적으로 수정되었어요.");
              await invalidateMany([[TOPIC.GET_ALL_TOPICS], [TOPIC.GET_TOPIC_BY_ID, topicId]]);
              onClose();
            },
          }
        );
      } else if (editingSticker.type === "custom_sticker") {
        await updateCustomSticker(
          {
            customStickerId: editingSticker.id,
            title,
            content,
          },
          {
            onSuccess: async () => {
              successToast("스티커가 성공적으로 수정되었어요.");
              invalidateQueries([TOPIC.GET_TOPIC_BY_ID, topicId]);
              onClose();
            },
          }
        );
      }
    } catch {
      errorToast("토픽 수정에 실패했어요.");
    }
  };

  const onCloseSidebar = () => {
    setEditingSticker(null);
    setShowEditStickerSidebar(false);
    onClose();
  };

  const onDelete = async (id: number) => {
    if (editingSticker?.type === "topic") {
      await removeTopic(id, {
        onSuccess: () => {
          successToast("토픽이 성공적으로 삭제되었어요.");
          onCloseSidebar();
          invalidateQueries([TOPIC.GET_ALL_TOPICS]);
          revalidatePath(`/topic?id=${id}`);
          router.back();
        },
        onError: () => {
          errorToast("토픽 삭제에 실패했어요.");
        },
      });
    } else if (editingSticker?.type === "custom_sticker") {
      await removeCustomSticker(id, {
        onSuccess: () => {
          successToast("스티커가 성공적으로 삭제되었어요.");
          onCloseSidebar();
          invalidateQueries([TOPIC.GET_ALL_TOPICS]);
        },
        onError: () => {
          errorToast("스티커 삭제에 실패했어요.");
        },
      });
    }
  };

  return (
    <Sidebar isOpen={showEditStickerSidebar} onClose={onClickOutside}>
      <div className="flex h-full flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">{currentType} 편집</h2>
          <Button variant="ghost" size="icon" onClick={onCloseSidebar} aria-label="사이드바 닫기">
            <X size={24} />
          </Button>
        </div>

        {/* 내용 */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* 제목 입력 */}
          <div>
            <label className="mb-2 block text-base font-medium">제목</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`${currentType} 제목을 입력하세요`}
              className="text-base"
            />
          </div>

          {/* 리치 텍스트 툴바 */}
          {editor && <EditTopicTooltipList editor={editor} />}

          {/* 리치 텍스트 에디터 */}
          <div className="">
            <label className="block text-base font-medium">내용</label>
            <EditorContent editor={editor} className="rounded-md border bg-white" />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="border-t p-6">
          <div className="flex gap-2">
            <Button
              onClick={onSave}
              className="h-12 flex-1 text-base"
              disabled={buttonDisabled || !title.trim()}
            >
              {isUpdatePending ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  저장
                </>
              )}
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
                id={editingSticker?.id || null}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                onDelete={onDelete}
              />
            </Dialog>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
