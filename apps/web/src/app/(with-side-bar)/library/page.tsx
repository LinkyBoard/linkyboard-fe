import LibraryPage from "@/page/library";
import { errorToast } from "@/utils/toast";

interface LibraryPageProps {
  searchParams: Promise<{
    category: string;
    tag: string;
  }>;
}

export default async function Library({ searchParams }: LibraryPageProps) {
  const { category, tag } = await searchParams;

  if (tag && !category) {
    return errorToast("잘못된 접근입니다.");
  }

  return <LibraryPage category={category} tag={tag} />;
}
