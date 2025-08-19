import { useStickerStore } from "@/lib/zustand/sticker-store";
import type { TopicDTO } from "@/models/topic";
import { Dialog, DialogTrigger } from "@repo/ui/components/dialog";

import { Edit, NotebookPen, Trash2 } from "lucide-react";

import { Button } from "../ui/button";

export default function TopicSticker({ item }: { item: TopicDTO }) {
  const { setEditingSticker, setShowEditStickerSidebar } = useStickerStore();

  const onEditTopic = () => {
    setEditingSticker({
      ...item,
      type: "topic",
    });
    setShowEditStickerSidebar(true);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex size-15 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
          <NotebookPen size={24} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 bg-white/20 text-white hover:bg-white/30"
            onClick={onEditTopic}
          >
            <Edit size={16} />
          </Button>
          <Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 bg-white/20 text-white hover:bg-white/30"
              asChild
            >
              <DialogTrigger>
                <Trash2 size={16} />
              </DialogTrigger>
            </Button>
          </Dialog>
        </div>
      </div>
      <div>
        <h2 className="mb-3 line-clamp-1 text-2xl leading-tight font-bold">{item.title}</h2>
        <p
          className="text-lg leading-relaxed opacity-90"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </div>
    </div>
  );
}
