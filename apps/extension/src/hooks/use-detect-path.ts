import { useEffect } from "react";

import { useTabStore } from "@/lib/zustand/tab";
import { useUserStore } from "@/lib/zustand/user";
import type { ChromeTabChangeInfoProps } from "@/types/chrome";
import { updateCurrentTab } from "@/utils/chrome";

import { useLocation } from "react-router-dom";

import { useReplaceNavigate } from "./use-replace-navigate";

export function useDetectPath() {
  const { currentTab, setCurrentTab, setIsFindingExistPath } = useTabStore();
  const { isLoggedIn, contents } = useUserStore();

  const navigate = useReplaceNavigate();
  const { pathname } = useLocation();
  const isCreateContentPage = pathname.includes("/create-content");

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
    if (isCreateContentPage) return;

    if (!isLoggedIn) {
      return navigate("/");
    }

    const findContent = contents.find(
      (content) => decodeURI(content.url) === decodeURI(currentTab.url)
    );

    if (findContent) {
      navigate(`/create-content?id=${findContent.id}`);
    } else {
      navigate("/search-content");
    }
    setIsFindingExistPath(false);
  }, [currentTab, contents, isLoggedIn, isCreateContentPage]);

  return { currentTab };
}
