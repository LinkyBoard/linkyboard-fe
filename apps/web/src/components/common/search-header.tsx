"use client";

import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import { Button, Input } from "@linkyboard/components";
import { cn } from "@linkyboard/utils";

import { Menu, Search } from "lucide-react";

export default function SearchHeader(props: React.ComponentProps<"input">) {
  const { className, ...rest } = props;

  const toggle = useMobileMenuStore((state) => state.toggle);

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggle}
        aria-label="메뉴 토글"
      >
        <Menu size={24} />
      </Button>
      <form className="relative w-96">
        <Search
          className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transform"
          size={20}
        />
        <Input type="text" className={cn("pl-10", className)} name="search" {...rest} />
      </form>
    </div>
  );
}
