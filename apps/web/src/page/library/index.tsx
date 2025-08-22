import Breadcrumb from "@/components/(with-side-bar)/library/breadcrumb";
import CategoryList from "@/components/(with-side-bar)/library/category-list";
import ContentList from "@/components/(with-side-bar)/library/content-list";

interface LibraryPageProps {
  category: string;
}

export default function LibraryPage({ category }: LibraryPageProps) {
  const currentLevel = category ? "tag" : "category";

  const renderContent = () => {
    switch (currentLevel) {
      case "category":
        return <CategoryList />;
      case "tag":
        return <ContentList category={category} />;
      default:
        return <CategoryList />;
    }
  };

  return (
    <div>
      <Breadcrumb currentLevel={currentLevel} currentCategory={category} />
      {renderContent()}
    </div>
  );
}
