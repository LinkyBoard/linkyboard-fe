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
