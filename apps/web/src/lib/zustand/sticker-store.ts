import type { TopicDTO } from "@/models/topic";
import { StickerType } from "@/types/topic";

import { create } from "zustand";

interface EditingSticker extends TopicDTO {
  type: StickerType;
}

interface StickerStore {
  showEditStickerSidebar: boolean;
  editingSticker: EditingSticker | null;
  setEditingSticker: (sticker: EditingSticker | null) => void;
  setShowEditStickerSidebar: (show: boolean) => void;
}

export const useStickerStore = create<StickerStore>((set) => ({
  showEditStickerSidebar: false,
  setShowEditStickerSidebar: (show: boolean) => {
    set({ showEditStickerSidebar: show });
  },

  editingSticker: null,
  setEditingSticker: (sticker: EditingSticker | null) => {
    set({ editingSticker: sticker });
  },
}));
