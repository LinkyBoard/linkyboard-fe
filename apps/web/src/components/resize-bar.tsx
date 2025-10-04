import { useEffect, useState } from "react";

import { cn } from "@linkyboard/utils";

interface ResizeBarProps {
  className?: string;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
}

export default function ResizeBar({ className, onMouseMove, onMouseUp }: ResizeBarProps) {
  const [isResizing, setIsResizing] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const onMouseMoveEvent = (e: MouseEvent) => {
    if (!isResizing) return;

    onMouseMove?.(e);
  };

  const onMouseUpEvent = (e: MouseEvent) => {
    setIsResizing(false);
    onMouseUp?.(e);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", onMouseMoveEvent);
      document.addEventListener("mouseup", onMouseUpEvent);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", onMouseMoveEvent);
        document.removeEventListener("mouseup", onMouseUpEvent);
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      };
    }
  }, [isResizing]);

  return (
    <div
      className={cn("bg-border w-1 cursor-col-resize transition-colors", className)}
      onMouseDown={onMouseDown}
      aria-label="사이드바 크기 조절"
    >
      <div className="bg-muted-foreground/50 absolute left-1/2 top-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
