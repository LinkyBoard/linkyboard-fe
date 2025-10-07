import AddCategoryDialog from "@/components/(with-side-bar)/library/layout/add-category-dialog";
import SearchHeader from "@/components/common/search-header";
import LibraryPage from "@/page/library";

interface LibraryPageProps {
  searchParams: Promise<{
    category: string;
  }>;
}

export default async function Library({ searchParams }: LibraryPageProps) {
  const { category } = await searchParams;

  return (
    <>
      <header className="border-border mb-8 flex items-center justify-between border-b pb-4">
        <SearchHeader placeholder="라이브러리에서 검색하세요" />
        <div className="flex items-center gap-4">
          <AddCategoryDialog />
        </div>
      </header>
      <LibraryPage category={category} />
    </>
  );
}
