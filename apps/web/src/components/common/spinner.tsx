import { cn } from "@linkyboard/utils";

import { Loader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className }: SpinnerProps) {
  return <Loader2 className={cn("text-primary animate-spin", className)} />;
}
