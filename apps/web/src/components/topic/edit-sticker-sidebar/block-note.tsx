"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { TOPIC } from "@/constants/topic";
import { invalidateMany, invalidateQueries } from "@/lib/tanstack";
import {
  useRemoveCustomSticker,
  useUpdateCustomSticker,
} from "@/lib/tanstack/mutation/custom-sticker";
import { useRemoveTopic, useUpdateTopic } from "@/lib/tanstack/mutation/topic";
import { useStickerStore } from "@/lib/zustand/sticker-store";
import { clientApi } from "@/services";
import { convertImageToWebP } from "@/utils/image";
import { containsMarkdown } from "@/utils/markdown";
import { revalidatePath } from "@/utils/revalidate";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { ko } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import {
  Button,
  Dialog,
  DialogTrigger,
  errorToast,
  Input,
  successToast,
} from "@linkyboard/components";
import type { BaseResponseDTO } from "@linkyboard/types";

import ky from "ky";
import { Loader2, Save, Trash2 } from "lucide-react";

import RemoveDialogContent from "../remove-dialog-content";

interface BlockNoteProps {
  setIsDeleteModalOpen: (isDeleteModalOpen: boolean) => void;
}

async function uploadFile(file: File) {
  const ext = file.type;
  if (!ext.includes("image")) {
    errorToast("이미지 파일만 업로드 가능해요.");
    return "";
  }

  try {
    const webpFile = await convertImageToWebP(file);
    console.log("webpFile", webpFile);

    const {
      result: { preSignedUrl },
    } = await clientApi
      .get<BaseResponseDTO<{ preSignedUrl: string }>>("generate-presigned-url", {
        searchParams: { fileName: webpFile.name },
      })
      .json();
    console.log("presignedUrl", preSignedUrl);

    const uploadResponse = await ky
      .put(preSignedUrl, {
        body: webpFile,
        headers: {
          "Content-Type": "image/webp",
        },
        retry: 0,
      })
      .json();
    console.log("uploadResponse", uploadResponse);
    successToast("이미지 업로드에 성공했어요.");

    const url = preSignedUrl.split("?")[0] || "";
    return url;
  } catch (err) {
    console.error(err);
    errorToast("이미지 업로드에 실패했어요.");
    return "";
  }
}

const blockNoteSchema = BlockNoteSchema.create({
  blockSpecs: {
    heading: defaultBlockSpecs.heading,
    paragraph: defaultBlockSpecs.paragraph,
    numberedListItem: defaultBlockSpecs.numberedListItem,
    quote: defaultBlockSpecs.quote,
    bulletListItem: defaultBlockSpecs.bulletListItem,
    checkListItem: defaultBlockSpecs.checkListItem,
    codeBlock: defaultBlockSpecs.codeBlock,
    table: defaultBlockSpecs.table,
    image: defaultBlockSpecs.image,
  },
});

export default function BlockNote({ setIsDeleteModalOpen }: BlockNoteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("id");

  const [title, setTitle] = useState("");

  // 토픽 관련 hook
  const { mutateAsync: updateTopic, isPending: isUpdatePending } = useUpdateTopic();
  const { mutateAsync: removeTopic, isPending: isDeletePending } = useRemoveTopic();

  // 스티커 관련 hook
  const { mutateAsync: updateCustomSticker, isPending: isUpdateCustomStickerPending } =
    useUpdateCustomSticker();
  const { mutateAsync: removeCustomSticker, isPending: isDeleteCustomStickerPending } =
    useRemoveCustomSticker();

  const editor = useCreateBlockNote({
    schema: blockNoteSchema,
    dictionary: ko,
    uploadFile,
  });

  const { setEditingSticker, setShowEditStickerSidebar, editingSticker, showEditStickerSidebar } =
    useStickerStore();

  const currentType = editingSticker?.type === "custom_sticker" ? "스티커" : "토픽";

  const buttonDisabled =
    isUpdatePending ||
    isDeletePending ||
    isUpdateCustomStickerPending ||
    isDeleteCustomStickerPending;

  const onSave = async () => {
    if (!editingSticker || !editor) return errorToast(`${currentType} 정보가 없어요.`);

    try {
      const content = editor.blocksToHTMLLossy();
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
      } else if (editingSticker.type === "custom_sticker" && topicId) {
        await updateCustomSticker(
          {
            customStickerId: editingSticker.id,
            topicId,
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

  const onClose = () => {
    setEditingSticker(null);
    setShowEditStickerSidebar(false);
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

  useEffect(() => {
    if (editingSticker && editor) {
      setTitle(editingSticker.title);

      const loadContent = async () => {
        try {
          if (editingSticker.content) {
            if (containsMarkdown(editingSticker.content)) {
              const blocks = await editor.tryParseMarkdownToBlocks(editingSticker.content);
              if (blocks) {
                editor.replaceBlocks(editor.document, blocks);
              }
            } else {
              const blocks = editor.tryParseHTMLToBlocks(editingSticker.content);
              if (blocks) {
                editor.replaceBlocks(editor.document, blocks);
              }
            }
          }
        } catch (error) {
          console.error("에디터 내용 로드 실패:", error);
          editor.replaceBlocks(editor.document, []);
        }
      };

      loadContent();
    }
  }, [editingSticker, editor]);

  useEffect(() => {
    if (!showEditStickerSidebar) {
      editor.replaceBlocks(editor.document, []);
    }
  }, [showEditStickerSidebar]);

  return (
    <>
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {/* 제목 입력 */}
        <div>
          <label className="mb-2 block font-medium">제목</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${currentType} 제목을 입력하세요`}
            className="text-base"
          />
        </div>

        <div className="h-full">
          <label className="mb-2 block font-medium">내용</label>
          <BlockNoteView className="border-border h-full rounded-md border" editor={editor} />
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
    </>
  );
}
