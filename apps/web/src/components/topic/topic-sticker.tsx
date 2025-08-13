import { useTopicStore } from "@/lib/zustand/topic-store";
import { TopicDTO } from "@/models/topic";
import { Dialog, DialogTrigger } from "@repo/ui/components/dialog";

import { Edit, Lightbulb, Trash2 } from "lucide-react";

import RemoveTopicDialog from "./remove-topic-dialog";
import { Button } from "../ui/button";

export default function TopicSticker({ item }: { item: TopicDTO }) {
  const { setEditingTopic, setShowNewTopicModal } = useTopicStore();

  const onEditTopic = () => {
    setEditingTopic(item);
    setShowNewTopicModal(true);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
          <Lightbulb size={24} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-white/20 text-white hover:bg-white/30"
            onClick={onEditTopic}
          >
            <Edit size={16} />
          </Button>
          <Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 bg-white/20 text-white hover:bg-white/30"
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
        <h2 className="mb-3 text-2xl leading-tight font-bold">{item.title}</h2>
        <p className="text-lg leading-relaxed opacity-90">{item.content}</p>
      </div>
    </>
  );
}
