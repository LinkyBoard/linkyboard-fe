import { create } from "zustand";

interface DashboardStore {
  totalLibraries: number;
  setTotalLibraries: (totalLibraries: number) => void;
  totalTopics: number;
  setTotalTopics: (totalTopics: number) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  totalLibraries: 0,
  setTotalLibraries: (totalLibraries) => set({ totalLibraries }),
  totalTopics: 0,
  setTotalTopics: (totalTopics) => set({ totalTopics }),
}));
