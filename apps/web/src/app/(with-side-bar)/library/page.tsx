import LibraryPage from "@/page/library";
import { errorToast } from "@/utils/toast";

interface LibraryPageProps {
  searchParams: Promise<{
    category: string;
    keyword: string;
  }>;
}

export default async function Library({ searchParams }: LibraryPageProps) {
  const { category, keyword } = await searchParams;

  if (keyword && !category) {
    return errorToast("잘못된 접근입니다.");
  }

  return <LibraryPage category={category} keyword={keyword} />;
}
