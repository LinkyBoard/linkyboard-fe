"use client";

import { useRouter } from "next/navigation";

import { CATEGORY } from "@/constants/category";
import { CONTENT } from "@/constants/content";
import { MINUTE } from "@/constants/time";
import { invalidateQueries, queryClient } from "@/lib/tanstack";
import { useDeleteCategory } from "@/lib/tanstack/mutation/category";
import { useGetCategories } from "@/lib/tanstack/query/category";
import type { CategoryDTO } from "@/models/category";
import { getCategoryContentById } from "@/services/content";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  successToast,
  useDialog,
} from "@linkyboard/components";

import { FileText, Loader2, Tag, Trash2 } from "lucide-react";

function DeleteCategoryDialog({ id, name }: { id: number; name: string }) {
  const { mutateAsync, isPending } = useDeleteCategory();
  const { close } = useDialog();

  const onDeleteCategory = async () => {
    await mutateAsync(id, {
      onSuccess: () => {
        invalidateQueries([CATEGORY.GET_CATEGORIES]);
        successToast(`${name} 카테고리를 삭제했어요.`);
        close();
      },
    });
  };

  return (
    <DialogContent>
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-lg font-semibold">삭제</h2>
          <p className="text-muted-foreground text-sm">{name} 카테고리를 삭제 하시겠습니까?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild disabled={isPending}>
            <DialogClose>취소</DialogClose>
          </Button>
          <Button onClick={onDeleteCategory} disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : "삭제"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

function CategoryItem(props: CategoryDTO) {
  const router = useRouter();

  const onRouteToCategory = () => {
    router.push(`/library?category=${props.id},${props.name}`);
  };

  const onMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: [CONTENT.GET_CATEGORY_CONTENT_BY_ID, props.id.toString()],
      queryFn: async () => getCategoryContentById(props.id.toString()),
      staleTime: MINUTE,
    });
  };

  return (
    <div
      className="bg-card border-border hover:border-primary relative cursor-pointer rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg"
      onMouseEnter={onMouseEnter}
    >
      <Dialog>
        <DialogTrigger
          className="absolute right-2 top-2 rounded-md p-1 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
          aria-label={`${props.name} 카테고리 삭제`}
        >
          <Trash2 size={16} />
        </DialogTrigger>
        <DeleteCategoryDialog id={props.id} name={props.name} />
      </Dialog>

      <button onClick={onRouteToCategory} className="w-full text-start">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600">
            <FileText size={24} />
          </div>
          <div className="line-clamp-2 text-lg font-semibold">{props.name}</div>
        </div>
        <div className="border-border flex gap-4 border-t pt-4">
          <div className="text-muted-foreground flex items-center gap-2 text-nowrap text-sm">
            <Tag size={16} />
            <span className="text-foreground font-semibold">{props.tagCount}</span> 태그
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-nowrap text-sm">
            <FileText size={16} />
            <span className="text-foreground font-semibold">{props.contentCount}</span> 콘텐츠
          </div>
        </div>
      </button>
    </div>
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((category: CategoryDTO) => (
        <CategoryItem key={category.id} {...category} />
      ))}
    </div>
  );
}
