import { create } from "zustand";

interface TopicStore {
  isOpen: boolean;
  topicId: string | null;
  stickerId: string | null;
  setIsOpen: (isOpen: boolean) => void;
  setTopicId: (topicId: string | null) => void;
  setStickerId: (stickerId: string | null) => void;
  reset: () => void;
}

export const useTopicStore = create<TopicStore>((set) => ({
  isOpen: false,
  topicId: null,
  stickerId: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setTopicId: (topicId) => set({ topicId }),
  setStickerId: (stickerId) => set({ stickerId }),
  reset: () => set({ isOpen: false, topicId: null, stickerId: null }),
}));
