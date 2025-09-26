"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useOutsideClick } from "@linkyboard/hooks";
import { cn } from "@linkyboard/utils";

import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
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

function DialogTrigger({ children, className, ...restProps }: HTMLAttributes<HTMLButtonElement>) {
  const { open } = useDialog();

  const onOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    open();
  };

  return (
    <button className={className} onClick={onOpen} {...restProps}>
      {children}
    </button>
  );
}

function DialogClose({ children, className, ...restProps }: HTMLAttributes<HTMLButtonElement>) {
  const { close } = useDialog();

  return (
    <button className={className} onClick={close} {...restProps}>
      {children}
    </button>
  );
}

function DialogContent(props: HTMLAttributes<HTMLDivElement>) {
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
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          ref={dialogRef}
          className={cn("m-5 w-full rounded-2xl bg-white", className)}
          tabIndex={-1}
          style={{
            maxWidth: "32rem",
            padding: "1.25rem",
          }}
          {...restProps}
        >
          {children}
        </div>
      </div>
    ),
    document.body
  );
}

export { Dialog, DialogClose, DialogContent, DialogTrigger, useDialog };
