"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import Sidebar from "@/components/sidebar";
import { useStickerStore } from "@/lib/zustand/sticker-store";
import { Button } from "@linkyboard/components";

import { X } from "lucide-react";

const BlockNote = dynamic(() => import("./block-note"), { ssr: false });

export default function EditTopicSidebar() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { setEditingSticker, setShowEditStickerSidebar, editingSticker, showEditStickerSidebar } =
    useStickerStore();

  const currentType = editingSticker?.type === "custom_sticker" ? "스티커" : "토픽";

  const onClose = () => {
    setEditingSticker(null);
    setShowEditStickerSidebar(false);
  };

  const onClickOutside = () => {
    if (!isDeleteModalOpen) {
      onClose();
    }
  };

  const onCloseSidebar = () => {
    setEditingSticker(null);
    setShowEditStickerSidebar(false);
    onClose();
  };

  return (
    <Sidebar isOpen={showEditStickerSidebar} onClose={onClickOutside}>
      <div className="flex h-full flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">{currentType} 편집</h2>
          <Button variant="ghost" size="icon" onClick={onCloseSidebar} aria-label="사이드바 닫기">
            <X size={24} />
          </Button>
        </div>

        {/* 내용 */}
        <BlockNote setIsDeleteModalOpen={setIsDeleteModalOpen} />
      </div>
    </Sidebar>
  );
}
