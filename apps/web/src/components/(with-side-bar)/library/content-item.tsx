import { CategoryContentDTO } from "@/models/content";
import { cn } from "@repo/ui/utils/cn";

import { FileText, Globe, Youtube } from "lucide-react";

interface ContentItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  item: CategoryContentDTO;
}

const contentType = {
  WEB: {
    icon: <Globe />,
    color: "text-blue-500",
  },
  YOUTUBE: {
    icon: <Youtube />,
    color: "text-red-500",
  },
  PDF: {
    icon: <FileText />,
    color: "text-gray-500",
  },
};

export default function ContentItem({ item, ...props }: ContentItemProps) {
  const { className, ...restProps } = props;

  return (
    <button
      className={cn(
        "bg-card border-border hover:border-primary group cursor-pointer rounded-lg border p-6 text-start transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg",
        className
      )}
      aria-label={`${item.title} 콘텐츠 상세보기`}
      {...restProps}
    >
      <div className="mb-4 flex items-center gap-4">
        <div
          className={cn(
            contentType[item.type].color,
            "flex size-12 items-center justify-center rounded-lg border p-2"
          )}
        >
          {contentType[item.type].icon}
        </div>
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
