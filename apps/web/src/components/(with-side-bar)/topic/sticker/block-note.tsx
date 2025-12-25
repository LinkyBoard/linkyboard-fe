"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CUSTOM_STICKER } from "@/constants/custom-sticker";
import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import {
  useRemoveCustomSticker,
  useUpdateCustomSticker,
} from "@/lib/tanstack/mutation/custom-sticker";
import { useRemoveTopic, useUpdateTopic } from "@/lib/tanstack/mutation/topic";
import { useGetCustomStickerById } from "@/lib/tanstack/query/custom-sticker";
import { useGetTopicById } from "@/lib/tanstack/query/topic";
import { useTopicStore } from "@/lib/zustand/topic";
import { uploadImage } from "@/services/image";
import { containsMarkdown } from "@/utils/markdown";
import { revalidatePath } from "@/utils/revalidate";
import { defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteSchema } from "@blocknote/core";
import { ko } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { Button, Dialog, DialogTrigger, errorToast, successToast } from "@linkyboard/components";

import { Loader2, Save, Trash2 } from "lucide-react";

import ToggleBlock from "./toggle-block";
import RemoveDialogContent from "../remove-dialog-content";

interface BlockNoteProps {
  topicId: string | null;
  stickerId: string | null;
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
    toggleListItem: ToggleBlock(),
  },
});

export default function BlockNote({ topicId, stickerId }: BlockNoteProps) {
  // stickerId가 있다면 커스텀 스티커(노란색) 조회
  const { data: topic, isLoading: isTopicLoading } = useGetTopicById({ id: topicId, stickerId });
  const { data: customSticker, isLoading: isCustomStickerLoading } =
    useGetCustomStickerById(stickerId);

  const topicStore = useTopicStore();

  const [title, setTitle] = useState(topic?.title || customSticker?.title || "");

  const editor = useCreateBlockNote({
    schema: blockNoteSchema,
    dictionary: ko,
    uploadFile: uploadImage,
  });

  const router = useRouter();

  // 토픽 관련 hook
  const { mutateAsync: updateTopic, isPending: isUpdatePending } = useUpdateTopic();
  const { mutateAsync: removeTopic, isPending: isDeletePending } = useRemoveTopic();

  // 스티커 관련 hook
  const { mutateAsync: updateCustomSticker, isPending: isUpdateCustomStickerPending } =
    useUpdateCustomSticker();
  const { mutateAsync: removeCustomSticker, isPending: isDeleteCustomStickerPending } =
    useRemoveCustomSticker();

  const isCustomSticker = !!stickerId;
  const buttonDisabled =
    isUpdatePending ||
    isDeletePending ||
    isUpdateCustomStickerPending ||
    isDeleteCustomStickerPending;

  const onSave = async () => {
    if (!topicId) return;
    try {
      const content = editor.blocksToHTMLLossy();
      if (!isCustomSticker) {
        await updateTopic(
          {
            id: topicId,
            title,
            content,
          },
          {
            onSuccess: async () => {
              successToast("토픽이 성공적으로 수정되었어요.");
              invalidateQueries([TOPIC.GET_ALL_TOPICS]);
              invalidateQueries([TOPIC.GET_TOPIC_BY_ID, topicId, stickerId]);
              invalidateQueries([TOPIC.GET_TOPIC_BOARD_BY_ID, topicId]);

              if (!topicStore.isOpen) {
                router.back();
              }
              topicStore.reset();
            },
          }
        );
        return;
      }
      if (!stickerId) return;
      await updateCustomSticker(
        {
          customStickerId: stickerId,
          topicId,
          title,
          content,
        },
        {
          onSuccess: async () => {
            successToast("스티커가 성공적으로 수정되었어요.");
            invalidateQueries([CUSTOM_STICKER.GET_CUSTOM_STICKER_BY_ID, stickerId]);
            invalidateQueries([TOPIC.GET_TOPIC_BOARD_BY_ID, topicId]);
            if (!topicStore.isOpen) {
              router.back();
            }
            topicStore.reset();
          },
        }
      );
    } catch {
      errorToast("토픽 수정에 실패했어요.");
    }
  };

  const onDelete = async () => {
    if (!isCustomSticker && topicId) {
      await removeTopic(topicId, {
        onSuccess: () => {
          successToast("토픽이 성공적으로 삭제되었어요.");
          invalidateQueries([TOPIC.GET_ALL_TOPICS]);
          revalidatePath(`/topic/${topicId}`);
          revalidatePath(`/topic/${topicId}/sticker`);
          router.push("/topic");
          topicStore.reset();
        },
        onError: () => {
          errorToast("토픽 삭제에 실패했어요.");
        },
      });
      return;
    }
    if (!stickerId) return;
    await removeCustomSticker(stickerId, {
      onSuccess: () => {
        successToast("스티커가 성공적으로 삭제되었어요.");
        invalidateQueries([TOPIC.GET_TOPIC_BOARD_BY_ID, topicId]);
        invalidateQueries([CUSTOM_STICKER.GET_CUSTOM_STICKER_BY_ID, stickerId]);
        if (!topicStore.isOpen) {
          router.back();
        }
        topicStore.reset();
      },
      onError: () => {
        errorToast("스티커 삭제에 실패했어요.");
      },
    });
  };

  useEffect(() => {
    setTitle(topic?.title || customSticker?.title || "");

    if (editor) {
      const content = topic?.content || customSticker?.content || "";

      const loadContent = async () => {
        try {
          if (containsMarkdown(content)) {
            const blocks = await editor.tryParseMarkdownToBlocks(content);
            if (blocks) {
              editor.replaceBlocks(editor.document, blocks);
            }
          } else {
            const blocks = editor.tryParseHTMLToBlocks(content);
            if (blocks) {
              editor.replaceBlocks(editor.document, blocks);
            }
          }
        } catch (error) {
          console.error("에디터 내용 로드 실패:", error);
          editor.replaceBlocks(editor.document, []);
        }
      };

      loadContent();
    }
  }, [editor, topic, customSticker]);

  return (
    <div className="h-full">
      {isTopicLoading || isCustomStickerLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="h-full space-y-2">
          <input
            className="border-border w-full border-b pb-3 text-3xl font-bold outline-none"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <BlockNoteView className="h-[calc(100%-9.25rem)]" editor={editor} />
          <div className="flex gap-3">
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
                id={Number(isCustomSticker ? stickerId : topicId)}
                onDelete={onDelete}
              />
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}
