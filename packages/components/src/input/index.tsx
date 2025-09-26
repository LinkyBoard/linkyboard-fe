import * as React from "react";

import { cn } from "@linkyboard/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-border bg-background text-foreground placeholder:text-muted-foreground flex h-12 w-full min-w-0 rounded-md border px-4 py-3 text-base transition-all duration-300 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-primary focus:shadow-[0_0_0_3px_rgba(85,85,255,0.1)] focus:ring-0",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "selection:bg-primary selection:text-primary-foreground",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
