import { useTopicStore } from "@/lib/zustand/topic-store";
import type { TopicDTO } from "@/models/topic";
import { Dialog, DialogTrigger } from "@repo/ui/components/dialog";

import { Edit, Sticker, Trash2 } from "lucide-react";

import RemoveTopicDialog from "./remove-topic-dialog";
import { Button } from "../ui/button";

export default function UserSticker({ item }: { item: TopicDTO }) {
  const { setEditingTopic, setShowEditTopicSidebar } = useTopicStore();

  const onEditTopic = () => {
    setEditingTopic(item);
    setShowEditTopicSidebar(true);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex size-15 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-yellow-900">
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
            <RemoveTopicDialog topicId={item.id} />
          </Dialog>
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-2xl leading-tight font-bold text-gray-800">{item.title}</h2>
        <p
          className="line-clamp-2 text-lg leading-relaxed text-gray-600"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </div>
    </>
  );
}
