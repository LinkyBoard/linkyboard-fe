import Image from "next/image";

import { CategoryContentDTO } from "@/models/content";

import { Link } from "lucide-react";

interface ContentItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  item: CategoryContentDTO;
}

export default function ContentItem({ item, ...restProps }: ContentItemProps) {
  return (
    <button
      className="bg-card border-border hover:border-primary group cursor-pointer rounded-lg border p-6 text-start transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg"
      aria-label={`${item.title} 콘텐츠 상세보기`}
      {...restProps}
    >
      <div className="mb-4 flex items-center gap-4">
        {item?.thumbnail ? (
          <div className="relative size-12 overflow-hidden rounded-lg border">
            <Image src={item.thumbnail} alt="페이지 썸네일" fill className="object-cover" />
          </div>
        ) : (
          <div className="from-primary to-chart-2 flex aspect-square size-12 items-center justify-center rounded-lg bg-gradient-to-r">
            <Link className="size-6 text-white" />
          </div>
        )}
        <div className="line-clamp-1 flex-1 text-lg font-semibold">{item.title}</div>
      </div>

      <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{item.summary}</p>

      <div className="flex flex-wrap gap-1">
        {item.tags.slice(0, 3).map((tag: string) => (
          <span key={tag} className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
            {tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
            +{item.tags.length - 3}
          </span>
        )}
      </div>
    </button>
  );
}
