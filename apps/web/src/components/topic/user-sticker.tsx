import { useStickerStore } from "@/lib/zustand/sticker-store";
import type { TopicDTO } from "@/models/topic";
import { containsMarkdown } from "@/utils/markdown";
import { markdownToHTML } from "@blocknote/core";
import { Dialog, DialogTrigger } from "@linkyboard/components";
import { Button } from "@linkyboard/components";

import { Edit, Sticker, Trash2 } from "lucide-react";

import RemoveUserStickerDialog from "./remove-user-sticker-dialog";

export default function UserSticker({ item, topicId }: { item: TopicDTO; topicId: string }) {
  const { setEditingSticker, setShowEditStickerSidebar } = useStickerStore();

  const onEditTopic = () => {
    setEditingSticker({
      ...item,
      type: "custom_sticker",
    });
    setShowEditStickerSidebar(true);
  };

  // 마크다운이 포함되어 있으면 HTML로 변환
  const renderContent = (content: string) => {
    if (content && containsMarkdown(content)) {
      return markdownToHTML(content);
    }
    return content;
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div className="size-15 flex shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-yellow-900">
          <Sticker size={24} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 bg-yellow-300/50 text-yellow-900 hover:bg-yellow-300/90"
            onClick={onEditTopic}
          >
            <Edit size={16} />
          </Button>
          <Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 bg-yellow-300/50 text-yellow-900 hover:bg-yellow-300/90"
              asChild
            >
              <DialogTrigger>
                <Trash2 size={16} />
              </DialogTrigger>
            </Button>
            <RemoveUserStickerDialog customStickerId={item.id} topicId={topicId} />
          </Dialog>
        </div>
      </div>
      <div>
        <h2 className="mb-3 line-clamp-1 text-2xl font-bold leading-tight text-gray-800">
          {item.title}
        </h2>
        <div dangerouslySetInnerHTML={{ __html: renderContent(item.content) }} />
      </div>
    </div>
  );
}
