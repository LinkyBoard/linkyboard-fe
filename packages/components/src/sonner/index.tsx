"use client";

import { useTheme } from "next-themes";

import type { ToasterProps } from "sonner";
import { toast, Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

const successToast = (message: string) => {
  toast.success(message, {
    style: {
      backgroundColor: "var(--color-primary)",
      color: "var(--color-primary-foreground)",
    },
  });
};

const infoToast = (message: string) => {
  toast.info(message, {
    style: {
      backgroundColor: "var(--color-secondary)",
      color: "var(--color-secondary-foreground)",
    },
  });
};

const errorToast = (message: string) => {
  toast.error(message, {
    style: {
      backgroundColor: "var(--color-destructive)",
      color: "var(--color-destructive-foreground)",
    },
  });
};

const promisedToast = (
  promise: Promise<unknown>,
  options?: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  toast.promise(promise, {
    loading: options?.loading || "잠시만 기다려주세요...",
    success: options?.success || "작업이 완료되었어요.",
    error: options?.error || "문제가 발생했어요.",
    style: {
      backgroundColor: "var(--color-secondary)",
      color: "var(--color-secondary-foreground)",
    },
  });
};

export { Toaster, successToast, infoToast, errorToast, promisedToast };
