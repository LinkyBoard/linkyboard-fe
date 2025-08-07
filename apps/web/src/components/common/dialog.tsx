"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { useOutsideClick } from "@repo/ui/hooks/use-outside-click";
import { cn } from "@repo/ui/utils/cn";

import { createPortal } from "react-dom";

interface DialogContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog 컴포넌트 내부에서만 사용할 수 있습니다.");
  }
  return context;
};

interface DialogProps {
  children: ReactNode;
}

function Dialog({ children }: DialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ isOpen, open, close }}>{children}</DialogContext.Provider>
  );
}

function DialogTrigger({
  children,
  className,
  ...restProps
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open } = useDialog();

  return (
    <button className={className} onClick={open} {...restProps}>
      {children}
    </button>
  );
}

function DialogClose({
  children,
  className,
  ...restProps
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { close } = useDialog();

  return (
    <button className={className} onClick={close} {...restProps}>
      {children}
    </button>
  );
}

function DialogContent(props: React.HTMLAttributes<HTMLDivElement>) {
  const { children, className, ...restProps } = props;

  const { isOpen, close } = useDialog();

  const [dialogRef] = useOutsideClick<HTMLDivElement>(() => {
    if (isOpen) {
      close();
    }
  });

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    isOpen && (
      <div
        role="dialog"
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50"
        aria-modal="true"
      >
        <div
          ref={dialogRef}
          className={cn("m-5 w-full max-w-lg rounded-2xl bg-white p-5", className)}
          tabIndex={-1}
          {...restProps}
        >
          {children}
        </div>
      </div>
    ),
    document.body
  );
}

export { Dialog, DialogTrigger, DialogContent, DialogClose, useDialog };
