"use client";

import AddCategoryDialog from "@/components/(with-side-bar)/library/layout/add-category-dialog";
import AddTagDialog from "@/components/(with-side-bar)/library/layout/add-tag-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";

import { Menu, Search } from "lucide-react";

interface LibraryLayoutProps {
  children: React.ReactNode;
}

export default function LibraryLayout({ children }: LibraryLayoutProps) {
  const { toggle } = useMobileMenuStore();

  return (
    <>
      <header className="border-border mb-8 flex items-center justify-between border-b pb-4">
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
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
              size={20}
            />
            <Input
              type="text"
              placeholder="라이브러리에서 검색하세요"
              className="pl-10"
              name="search"
              aria-label="라이브러리 검색"
            />
          </form>
        </div>
        <div className="flex items-center gap-4">
          <AddCategoryDialog />
          <AddTagDialog />
        </div>
      </header>
      {children}
    </>
  );
}
