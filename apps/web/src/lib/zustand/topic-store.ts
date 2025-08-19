import { create } from "zustand";

interface TopicStore {
  showNewTopicModal: boolean;
  setShowNewTopicModal: (show: boolean) => void;
}

export const useTopicStore = create<TopicStore>((set) => ({
  showNewTopicModal: false,
  setShowNewTopicModal: (show: boolean) => {
    set({ showNewTopicModal: show });
  },
}));
