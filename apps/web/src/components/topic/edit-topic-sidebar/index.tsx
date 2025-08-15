"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOPIC } from "@/constants/topic";
import { invalidateMany, invalidateQueries } from "@/lib/tanstack";
import { useRemoveTopic, useUpdateTopic } from "@/lib/tanstack/mutation/topic";
import { useTopicStore } from "@/lib/zustand/topic-store";
import { revalidatePath } from "@/utils/revalidate";
import { errorToast, successToast } from "@/utils/toast";
import { Dialog, DialogTrigger } from "@repo/ui/components/dialog";
import { useOutsideClick } from "@repo/ui/hooks/use-outside-click";
import { cn } from "@repo/ui/utils/cn";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Loader2, Save, Trash2, X } from "lucide-react";

import EditTopicTooltipList from "./edit-topic-tooltip-list";
import RemoveDialogContent from "../remove-dialog-content";

export default function EditTopicSidebar() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutateAsync: updateTopic, isPending: isUpdatePending } = useUpdateTopic();
  const { mutateAsync: removeTopic, isPending: isDeletePending } = useRemoveTopic();
  const { setEditingTopic, setShowEditTopicSidebar, editingTopic, showEditTopicSidebar } =
    useTopicStore();

  const onClose = () => {
    setEditingTopic(null);
    setShowEditTopicSidebar(false);
  };

  const [sidebarRef] = useOutsideClick<HTMLDivElement>(() => {
    if (!isDeleteModalOpen) {
      onClose();
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
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
        class: "prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4",
      },
    },
  });

  useEffect(() => {
    if (editingTopic && editor) {
      setTitle(editingTopic.title);
      editor.commands.setContent(editingTopic.content || "");
    }
  }, [editingTopic, editor]);

  const onSave = async () => {
    if (!editingTopic || !editor) return errorToast("토픽 정보가 없어요.");

    try {
      const content = editor.getHTML();
      await updateTopic(
        {
          id: editingTopic.id,
          title,
          content,
        },
        {
          onSuccess: async () => {
            successToast("토픽이 성공적으로 수정되었어요.");
            await invalidateMany([
              [TOPIC.GET_ALL_TOPICS],
              [TOPIC.GET_TOPIC_BY_ID, editingTopic?.id.toString()],
            ]);
            onClose();
          },
        }
      );
    } catch {
      errorToast("토픽 수정에 실패했어요.");
    }
  };

  const onCloseSidebar = () => {
    setEditingTopic(null);
    setShowEditTopicSidebar(false);
    onClose();
  };

  const onDelete = async (id: number) => {
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
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50",
        showEditTopicSidebar && "pointer-events-auto bg-black/50"
      )}
      aria-label="토픽 편집 사이드바 닫기"
    >
      {/* 사이드바 */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-xl transform bg-white shadow-xl transition-all duration-300 ease-out",
          showEditTopicSidebar ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-xl font-semibold">토픽 편집</h2>
            <Button variant="ghost" size="icon" onClick={onCloseSidebar} aria-label="사이드바 닫기">
              <X size={24} />
            </Button>
          </div>

          {/* 내용 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* 제목 입력 */}
              <div>
                <label className="mb-2 block text-base font-medium">제목</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="토픽 제목을 입력하세요"
                  className="text-base"
                />
              </div>

              {/* 리치 텍스트 툴바 */}
              {editor && <EditTopicTooltipList editor={editor} />}

              {/* 리치 텍스트 에디터 */}
              <div>
                <label className="mb-2 block text-base font-medium">내용</label>
                <div className="min-h-[400px] rounded-md border bg-white">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="border-t p-6">
            <div className="flex gap-2">
              <Button
                onClick={onSave}
                className="h-12 flex-1 text-base"
                disabled={isUpdatePending || !title.trim()}
              >
                {isUpdatePending ? (
                  <Loader2 size={18} className="mr-2 animate-spin" />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                저장
              </Button>
              <Dialog>
                <Button
                  className="h-12 bg-red-400 text-base hover:bg-red-500"
                  asChild
                  disabled={isUpdatePending || isDeletePending}
                >
                  <DialogTrigger>
                    <Trash2 size={18} className="mr-2" />
                    삭제
                  </DialogTrigger>
                </Button>
                <RemoveDialogContent
                  id={editingTopic?.id || null}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  onDelete={onDelete}
                />
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
