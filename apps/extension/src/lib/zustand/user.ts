import type { CategoryContentDTO } from "@repo/types";

import { create } from "zustand";

interface UserStoreprops {
  isLoggedIn: boolean;
  contents: CategoryContentDTO[];
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setContents: (contents: CategoryContentDTO[]) => void;
}

export const useUserStore = create<UserStoreprops>((set) => ({
  isLoggedIn: false,
  contents: [],
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setContents: (contents) => set({ contents }),
}));
