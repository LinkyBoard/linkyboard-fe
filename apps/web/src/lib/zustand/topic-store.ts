import type { TopicDTO } from "@/models/topic";

import { create } from "zustand";

interface TopicStore {
  showNewTopicModal: boolean;
  editingTopic: TopicDTO | null;
  setEditingTopic: (topic: TopicDTO | null) => void;
  setShowNewTopicModal: (show: boolean) => void;
}

export const useTopicStore = create<TopicStore>((set) => ({
  showNewTopicModal: false,
  setShowNewTopicModal: (show: boolean) => {
    set({ showNewTopicModal: show });
  },

  editingTopic: null,
  setEditingTopic: (topic: TopicDTO | null) => {
    set({ editingTopic: topic });
  },
}));
