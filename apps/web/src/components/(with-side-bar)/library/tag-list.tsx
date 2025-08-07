import Link from "next/link";

import { FileText, Tag } from "lucide-react";

interface KnowledgeItem {
  id: number;
  title: string;
  type: string;
  description: string;
  tags: string[];
  date: string;
}

interface TagData {
  name: string;
  knowledge: KnowledgeItem[];
}

interface TagListProps {
  category: string | null;
  tags: TagData[];
}

function TagItem({ href, tag }: { href: string; tag: TagData }) {
  const knowledgeCount = tag.knowledge.length;

  return (
    <Link
      className="bg-card border-border hover:border-primary cursor-pointer rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg"
      href={href}
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
          <Tag size={24} />
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold">{tag.name}</div>
          <div className="text-muted-foreground text-sm">{knowledgeCount}개의 콘텐츠</div>
        </div>
      </div>
      <div className="border-border flex gap-4 border-t pt-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <FileText size={16} />
          <span className="text-foreground font-semibold">{knowledgeCount}</span> 콘텐츠
        </div>
      </div>
    </Link>
  );
}

export default function TagList({ category, tags }: TagListProps) {
  if (!category || !tags.length) {
    return (
      <div className="py-12 text-center">
        <div className="text-muted-foreground mb-4 text-4xl">📁</div>
        <h3 className="mb-2 text-xl font-semibold">카테고리를 찾을 수 없습니다</h3>
        <p className="text-muted-foreground">선택한 카테고리가 존재하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tags.map((tag) => (
        <TagItem key={tag.name} href={`/library?category=${category}&tag=${tag.name}`} tag={tag} />
      ))}
    </div>
  );
}
