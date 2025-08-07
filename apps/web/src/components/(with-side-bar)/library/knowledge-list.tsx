import { Button } from "@/components/ui/button";
import { cn } from "@repo/ui/utils/cn";
import { KnowledgeItemProps } from "@/types/library";

import {
  Edit,
  File,
  FileText,
  type LucideIcon,
  MoreVertical,
  StickyNote,
  Video,
} from "lucide-react";

interface KnowledgeListProps {
  keyword: string;
  knowledges: KnowledgeItemProps[];
}

const getIconClass = (type: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    article: FileText,
    pdf: File,
    note: StickyNote,
    video: Video,
  };
  return iconMap[type] || FileText;
};

const getIconName = (type: string) => {
  const nameMap: Record<string, string> = {
    article: "아티클",
    pdf: "PDF",
    note: "노트",
    video: "비디오",
  };
  return nameMap[type] || "파일";
};

const getIconColor = (type: string) => {
  const colorMap: Record<string, string> = {
    article: "bg-blue-100 text-blue-600",
    pdf: "bg-red-100 text-red-600",
    note: "bg-green-100 text-green-600",
    video: "bg-orange-100 text-orange-600",
  };
  return colorMap[type] || "bg-muted text-muted-foreground";
};

function KnowledgeItem({ item }: { item: KnowledgeItemProps }) {
  const IconComponent = getIconClass(item.type);

  return (
    <div className="border-border hover:bg-accent/50 flex cursor-pointer items-center gap-4 border-b p-6 transition-colors duration-300">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md",
          getIconColor(item.type)
        )}
      >
        <IconComponent size={20} />
      </div>
      <div className="flex-1">
        <div className="mb-1 font-semibold">{item.title}</div>
        <div className="text-muted-foreground mb-2 flex items-center gap-4 text-sm">
          <span>{item.date}</span>
          <span>•</span>
          <span>{getIconName(item.type).toUpperCase()}</span>
        </div>
        <p className="text-muted-foreground mb-3 text-sm">{item.description}</p>
        <div className="flex gap-2">
          {item.tags.map((tag: string) => (
            <span key={tag} className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" aria-label="편집">
          <Edit size={16} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="더보기">
          <MoreVertical size={16} />
        </Button>
      </div>
    </div>
  );
}

export default function KnowledgeList({ keyword, knowledges }: KnowledgeListProps) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-lg border">
      <div className="border-border flex items-center justify-between border-b p-6">
        <h2 className="text-xl font-semibold">{keyword} - 콘텐츠 목록</h2>
      </div>

      {knowledges.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4 text-4xl">📄</div>
          <h3 className="mb-2 text-xl font-semibold">콘텐츠가 없습니다</h3>
          <p className="text-muted-foreground">이 키워드에 해당하는 콘텐츠가 아직 없습니다.</p>
        </div>
      ) : (
        <div>
          {knowledges.map((item: KnowledgeItemProps) => (
            <KnowledgeItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
