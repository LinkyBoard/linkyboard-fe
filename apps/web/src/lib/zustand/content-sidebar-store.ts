import { create } from "zustand";

interface ContentSidebarStore {
  isOpen: boolean;
  selectedContentId: number | null;
  onOpen: (selectedContentId: number) => void;
  onClose: () => void;
}

export const useContentSidebarStore = create<ContentSidebarStore>((set) => ({
  isOpen: false,
  selectedContentId: null,
  onOpen: (selectedContentId: number) => {
    set({ isOpen: true, selectedContentId });
  },
  onClose: () => {
    set({ isOpen: false, selectedContentId: null });
  },
}));
