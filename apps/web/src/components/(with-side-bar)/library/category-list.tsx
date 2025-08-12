"use client";

import Link from "next/link";

import { useGetCategories } from "@/lib/tanstack/query/category";
import { CategoryDTO } from "@/models/category";

import { FileText, Loader2, Tag } from "lucide-react";

function CategoryItem(props: CategoryDTO) {
  return (
    <Link
      className="bg-card border-border hover:border-primary cursor-pointer rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg"
      href={`/library?category=${props.id},${props.name}`}
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
          <FileText size={24} />
        </div>
        <div className="text-lg font-semibold">{props.name}</div>
      </div>
      <div className="border-border flex gap-4 border-t pt-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm text-nowrap">
          <Tag size={16} />
          <span className="text-foreground font-semibold">{props.tagCount}</span> 태그
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm text-nowrap">
          <FileText size={16} />
          <span className="text-foreground font-semibold">{props.contentCount}</span> 콘텐츠
        </div>
      </div>
    </Link>
  );
}

export default function CategoryList() {
  const { data, isLoading } = useGetCategories();

  const isCategoryExist = data && data.length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin" />
        <p>카테고리를 가져오고 있어요</p>
      </div>
    );
  }

  if (!isCategoryExist) {
    return <p className="text-center">생성된 카테고리가 없어요</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data?.map((category) => (
        <CategoryItem key={category.id} {...category} />
      ))}
    </div>
  );
}
