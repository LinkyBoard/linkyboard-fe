import { useEffect } from "react";

import { useTabStore } from "@/lib/zustand/tab";
import { ChromeTabChangeInfoProps } from "@/types/chrome";
import { updateCurrentTab } from "@/utils/chrome";

export function useDetectPath() {
  const { currentTab, setCurrentTab, setIsFindingExistPath } = useTabStore();

  useEffect(() => {
    updateCurrentTab(setCurrentTab);

    const onTabActived = () => {
      setIsFindingExistPath(true);
      updateCurrentTab(setCurrentTab);
    };

    const onTabUpdated = (_: number, changeInfo: ChromeTabChangeInfoProps) => {
      if (changeInfo.url && changeInfo.status === "loading") {
        setIsFindingExistPath(true);
        updateCurrentTab(setCurrentTab);
      }
    };

    chrome.tabs.onActivated.addListener(onTabActived);
    chrome.tabs.onUpdated.addListener(onTabUpdated);

    return () => {
      chrome.tabs.onActivated.removeListener(onTabActived);
      chrome.tabs.onUpdated.removeListener(onTabUpdated);
    };
  }, []);

  useEffect(() => {
    setIsFindingExistPath(false);
  }, [currentTab]);

  return { currentTab };
}
