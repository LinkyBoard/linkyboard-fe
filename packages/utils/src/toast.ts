import { toast } from "sonner";

export const successToast = (message: string) => {
  toast.success(message, {
    style: {
      backgroundColor: "var(--color-primary)",
      color: "var(--color-primary-foreground)",
    },
  });
};

export const infoToast = (message: string) => {
  toast.info(message, {
    style: {
      backgroundColor: "var(--color-secondary)",
      color: "var(--color-secondary-foreground)",
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    style: {
      backgroundColor: "var(--color-destructive)",
      color: "var(--color-destructive-foreground)",
    },
  });
};

export const promisedToast = (
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
