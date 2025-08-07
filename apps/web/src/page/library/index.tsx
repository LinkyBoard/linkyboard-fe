import Breadcrumb from "@/components/(with-side-bar)/library/breadcrumb";
import CategoryList from "@/components/(with-side-bar)/library/category-list";
import KnowledgeList from "@/components/(with-side-bar)/library/knowledge-list";
import { libraryData } from "@/constants/sample-data";

interface LibraryPageProps {
  category: string;
  id: string;
}

export default function LibraryPage({ category, id }: LibraryPageProps) {
  const currentLevel = category ? "tag" : "category";

  const allKnowledges = (() => {
    if (!category) return [];
    const categoryData = libraryData.find((item) => item.name === category);
    if (!categoryData) return [];

    return categoryData.tags.flatMap((tag) => tag.knowledge);
  })();

  const renderContent = () => {
    switch (currentLevel) {
      case "category":
        return <CategoryList categories={libraryData} />;
      case "tag":
        return <KnowledgeList knowledges={allKnowledges} category={category} id={id} />;
      default:
        return <CategoryList categories={libraryData} />;
    }
  };

  return (
    <div>
      <Breadcrumb currentLevel={currentLevel} currentCategory={category} />
      {renderContent()}
    </div>
  );
}
