import React, { useCallback, useContext, useEffect, useState } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/common/context-menu";
import { TopicContext } from "@/context/topic-context";
import { useCreateContent } from "@/lib/tanstack/mutation/topic-content";
import type { CategoryContentDTO } from "@linkyboard/types";
import type { Node } from "@xyflow/react";

interface ContextMenuProviderProps {
  children: React.ReactNode;
  isTriggerDisabled: boolean;
}

const isMac = typeof window !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

const onEscapeContextMenu = () => {
  const escEvent = new KeyboardEvent("keydown", { key: "Escape" });
  document.dispatchEvent(escEvent);
};

export default function ContextMenuProvider({
  children,
  isTriggerDisabled,
}: ContextMenuProviderProps) {
  const topicContext = useContext(TopicContext);
  if (!topicContext) {
    throw new Error("TopicContext not found");
  }

  const { id, nodes, selectedNodeIds } = topicContext;

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const { mutateAsync: createContent } = useCreateContent(id);

  const onDuplicate = useCallback(() => {
    selectedNodeIds.forEach(async (nodeId) => {
      const node: Node | undefined = nodes.find((node) => node.id === nodeId);
      if (!node) return;
      const { item } = node.data as { item: CategoryContentDTO };

      await createContent({
        topicId: id,
        contentId: item.id,
        posX: node.position.x + 100,
        posY: node.position.y + 100,
      });
    });
  }, [id, createContent, selectedNodeIds, nodes]);

  const onLink = useCallback(() => {
    console.log("Link 실행");
    // 여기에 Link 로직 추가
  }, []);

  const onUnlink = useCallback(() => {
    console.log("Unlink 실행");
    // 여기에 Unlink 로직 추가
  }, []);

  const onSummary = useCallback(() => {
    console.log("Summary 실행");
    // 여기에 Summary 로직 추가
  }, []);

  const onDelete = useCallback(() => {
    console.log("Delete 실행");
    // 여기에 Delete 로직 추가
  }, []);

  const onCloseContextMenu = useCallback(() => {
    setIsContextMenuOpen(false);
    onEscapeContextMenu();
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isModifierPressed = isMac ? e.metaKey : e.ctrlKey;

      switch (key) {
        case "d":
          if (!isModifierPressed) return;
          e.preventDefault();
          onDuplicate();
          onCloseContextMenu();
          break;
        case "l":
          e.preventDefault();
          onLink();
          onCloseContextMenu();
          break;
        case "u":
          e.preventDefault();
          onUnlink();
          onCloseContextMenu();
          break;
        case "s":
          e.preventDefault();
          onSummary();
          onCloseContextMenu();
          break;
        case "x":
          e.preventDefault();
          onDelete();
          onCloseContextMenu();
          break;
      }
    },
    [onCloseContextMenu, onDuplicate, onLink, onUnlink, onSummary, onDelete]
  );

  useEffect(() => {
    if (!open) return;

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isContextMenuOpen, onKeyDown]);

  return (
    <ContextMenu onOpenChange={setIsContextMenuOpen}>
      <ContextMenuTrigger asChild disabled={isTriggerDisabled}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-60 rounded-2xl bg-[#333] p-5 text-white">
        <ContextMenuItem
          className="flex items-center justify-between rounded-xl px-4 py-1 focus:bg-[#7E4ED7] focus:text-white"
          onSelect={onDuplicate}
        >
          <p className="text-xl font-bold">Duplicate</p>
          <p className="font-light">{isMac ? "⌘D" : "Ctrl+D"}</p>
        </ContextMenuItem>
        <ContextMenuSeparator className="my-5" />
        <ContextMenuItem
          className="focus:bg-primary flex items-center justify-between rounded-xl px-4 py-1 focus:text-white"
          onSelect={onLink}
        >
          <p className="text-xl font-bold">Link</p>
          <p className="font-light">L</p>
        </ContextMenuItem>
        <ContextMenuItem
          className="focus:bg-primary flex items-center justify-between rounded-xl px-4 py-1 focus:text-white"
          onSelect={onUnlink}
        >
          <p className="text-xl font-bold">Unlink</p>
          <p className="font-light">U</p>
        </ContextMenuItem>
        <ContextMenuItem
          className="focus:bg-primary flex items-center justify-between rounded-xl px-4 py-1 focus:text-white"
          onSelect={onSummary}
        >
          <p className="text-xl font-bold">Summary</p>
          <p className="font-light">S</p>
        </ContextMenuItem>
        <ContextMenuItem
          className="focus:bg-primary flex items-center justify-between rounded-xl px-4 py-1 focus:text-white"
          onSelect={onDelete}
        >
          <p className="text-xl font-bold">Delete</p>
          <p className="font-light">X</p>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
