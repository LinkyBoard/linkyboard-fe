"use client";

import { useEffect, useState } from "react";

import { useOutsideClick } from "@linkyboard/hooks";
import { cn } from "@linkyboard/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MIN_WIDTH = 448;
const MAX_WIDTH = 576;

export default function Sidebar({ isOpen, onClose, children }: SidebarProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(448);

  const [sidebarRef] = useOutsideClick<HTMLDivElement>(() => {
    if (isOpen && !isResizing) {
      onClose();
    }
  });

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = window.innerWidth - e.clientX;

    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setSidebarWidth(newWidth);
    }
  };

  const onMouseUp = () => {
    setIsResizing(false);
  };

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      };
    }
  }, [isResizing]);

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
          "fixed top-0 right-0 z-50 h-full bg-white shadow-xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
        style={{ width: `${sidebarWidth}px` }}
      >
        {children}

        {/* Resize Handle */}
        <div
          className="bg-border absolute top-0 left-0 h-full w-1 cursor-col-resize transition-colors"
          onMouseDown={onMouseDown}
          aria-label="사이드바 크기 조절"
        >
          <div className="bg-muted-foreground/50 absolute top-1/2 left-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}
