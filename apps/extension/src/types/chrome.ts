export interface ChromeTabChangeInfoProps {
  status?: chrome.tabs.TabStatus;
  url?: string;
  groupId?: number;
  pinned?: boolean;
  audible?: boolean;
  frozen?: boolean;
  discarded?: boolean;
  autoDiscardable?: boolean;
  mutedInfo?: chrome.tabs.MutedInfo;
  favIconUrl?: string;
  title?: string;
}
