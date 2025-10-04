"use client";

import { useState } from "react";

import { useOutsideClick } from "@linkyboard/hooks";
import { cn } from "@linkyboard/utils";

import ResizeBar from "./resize-bar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MIN_WIDTH = 448;
const MAX_WIDTH = 576;

export default function Sidebar({ isOpen, onClose, children }: SidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(448);

  const [sidebarRef] = useOutsideClick<HTMLDivElement>(() => {
    if (isOpen) {
      onClose();
    }
  });

  const onMouseMove = (e: MouseEvent) => {
    const newWidth = window.innerWidth - e.clientX;

    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setSidebarWidth(newWidth);
    }
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50",
        isOpen && "pointer-events-auto bg-black/50"
      )}
      aria-label="사이드바 닫기"
    >
      <div
        ref={sidebarRef}
        className={cn(
          "fixed right-0 top-0 z-50 h-full bg-white shadow-xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
        style={{ width: `${sidebarWidth}px` }}
      >
        {children}

        <ResizeBar className="absolute left-0 top-0 h-full" onMouseMove={onMouseMove} />
      </div>
    </div>
  );
}
