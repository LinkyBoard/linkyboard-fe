import Link from "next/link";

import { cn } from "@repo/ui/utils/cn";

import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  currentLevel: "category" | "tag" | "knowledge";
  currentCategory: string | null;
  currentTag: string | null;
}

export default function Breadcrumb({ currentLevel, currentCategory, currentTag }: BreadcrumbProps) {
  return (
    <nav className="mb-8 flex items-center gap-2 text-sm">
      <Link
        className={cn(
          "hover:text-primary transition-colors",
          currentLevel === "category" ? "text-foreground font-semibold" : "text-muted-foreground"
        )}
        href="/library"
      >
        카테고리
      </Link>

      {currentCategory && (
        <>
          <ChevronRight size={16} className="text-muted-foreground" />
          <Link
            className={cn(
              "hover:text-primary transition-colors",
              currentLevel === "tag" ? "text-foreground font-semibold" : "text-muted-foreground"
            )}
            href={`/library?category=${currentCategory}`}
          >
            {currentCategory}
          </Link>
        </>
      )}

      {currentTag && currentCategory && (
        <>
          <ChevronRight size={16} className="text-muted-foreground" />
          <span className="text-foreground font-semibold">{currentTag}</span>
        </>
      )}
    </nav>
  );
}
