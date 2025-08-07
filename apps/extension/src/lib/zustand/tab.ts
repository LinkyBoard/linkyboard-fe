import { create } from "zustand";

interface TabStoreProps {
  currentTab: {
    url: string;
    title: string;
  };
  isFindingExistPath: boolean;
  setCurrentTab: (tab: TabStoreProps["currentTab"]) => void;
  setIsFindingExistPath: (isFindingExistPath: boolean) => void;
}

export const useTabStore = create<TabStoreProps>((set) => ({
  currentTab: {
    url: "사이트 url",
    title: "사이트 title",
  },
  isFindingExistPath: false,
  setCurrentTab: (tab: TabStoreProps["currentTab"]) => set({ currentTab: tab }),
  setIsFindingExistPath: (isFindingExistPath: boolean) => set({ isFindingExistPath }),
}));
