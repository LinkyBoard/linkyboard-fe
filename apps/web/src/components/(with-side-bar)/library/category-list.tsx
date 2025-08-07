import Link from "next/link";

import { LibraryProps } from "@/types/library";

import { FileText, Tag } from "lucide-react";

interface CategoryListProps {
  categories: LibraryProps[];
}

function CategoryItem({ category }: { category: LibraryProps }) {
  return (
    <Link
      className="bg-card border-border hover:border-primary cursor-pointer rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg"
      href={`/library?category=${category.name}`}
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
          <FileText size={24} />
        </div>
        <div className="text-lg font-semibold">{category.name}</div>
      </div>
      <div className="border-border flex gap-4 border-t pt-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm text-nowrap">
          <Tag size={16} />
          <span className="text-foreground font-semibold">{category.tagCount}</span> 태그
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm text-nowrap">
          <FileText size={16} />
          <span className="text-foreground font-semibold">{category.knowledgeCount}</span> 콘텐츠
        </div>
      </div>
    </Link>
  );
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => (
        <CategoryItem key={category.name} category={category} />
      ))}
    </div>
  );
}
