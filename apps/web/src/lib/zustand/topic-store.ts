import type { TopicDTO } from "@/models/topic";
import { StickerType } from "@/types/topic";

import { create } from "zustand";

interface EditingTopic extends TopicDTO {
  type: StickerType;
}

interface TopicStore {
  showNewTopicModal: boolean;
  showEditTopicSidebar: boolean;
  editingTopic: EditingTopic | null;
  setEditingTopic: (topic: EditingTopic | null) => void;
  setShowNewTopicModal: (show: boolean) => void;
  setShowEditTopicSidebar: (show: boolean) => void;
}

export const useTopicStore = create<TopicStore>((set) => ({
  showNewTopicModal: false,
  showEditTopicSidebar: false,
  setShowNewTopicModal: (show: boolean) => {
    set({ showNewTopicModal: show });
  },
  setShowEditTopicSidebar: (show: boolean) => {
    set({ showEditTopicSidebar: show });
  },

  editingTopic: null,
  setEditingTopic: (topic: EditingTopic | null) => {
    set({ editingTopic: topic });
  },
}));
