import Breadcrumb from "@/components/(with-side-bar)/library/breadcrumb";
import CategoryList from "@/components/(with-side-bar)/library/category-list";
import ContentList from "@/components/(with-side-bar)/library/content-list";

interface LibraryPageProps {
  category: string;
}

export default function LibraryPage({ category }: LibraryPageProps) {
  const currentLevel = category ? "tag" : "category";

  return (
    <div>
      <Breadcrumb currentLevel={currentLevel} currentCategory={category} />
      {currentLevel === "category" ? <CategoryList /> : <ContentList category={category} />}
    </div>
  );
}
