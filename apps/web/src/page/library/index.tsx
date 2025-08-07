import Breadcrumb from "@/components/(with-side-bar)/library/breadcrumb";
import CategoryList from "@/components/(with-side-bar)/library/category-list";
import KeywordList from "@/components/(with-side-bar)/library/keyword-list";
import KnowledgeList from "@/components/(with-side-bar)/library/knowledge-list";
import type { LibraryProps } from "@/types/library";

interface LibraryPageProps {
  category: string;
  keyword: string;
}

const libraryData: LibraryProps[] = [
  {
    name: "기술",
    keywordCount: 2,
    knowledgeCount: 2,
    keywords: [
      {
        name: "AI",
        knowledge: [
          {
            id: 1,
            title: "머신러닝 기초",
            type: "article",
            description: "머신러닝의 기본 개념과 알고리즘에 대한 포괄적인 가이드",
            tags: ["머신러닝", "알고리즘", "AI"],
            date: "2024-01-15",
          },
          {
            id: 2,
            title: "딥러닝 프레임워크 비교",
            type: "pdf",
            description: "TensorFlow, PyTorch, Keras 등 주요 딥러닝 프레임워크 분석",
            tags: ["딥러닝", "프레임워크", "AI"],
            date: "2024-01-10",
          },
        ],
      },
      {
        name: "개발",
        knowledge: [],
      },
    ],
  },
  {
    name: "디자인",
    keywordCount: 0,
    knowledgeCount: 0,
    keywords: [],
  },
];

export default function LibraryPage({ category, keyword }: LibraryPageProps) {
  const currentLevel = keyword ? "knowledge" : category ? "keyword" : "category";

  const keywords = category
    ? libraryData.find((item) => item.name === category)?.keywords || []
    : [];
  const knowledges = keyword ? keywords.find((item) => item.name === keyword)?.knowledge || [] : [];

  const renderContent = () => {
    switch (currentLevel) {
      case "category":
        return <CategoryList categories={libraryData} />;
      case "keyword":
        return <KeywordList category={category} keywords={keywords} />;
      case "knowledge":
        return <KnowledgeList keyword={keyword} knowledges={knowledges} />;
      default:
        return <CategoryList categories={libraryData} />;
    }
  };

  return (
    <div>
      <Breadcrumb currentLevel={currentLevel} currentCategory={category} currentKeyword={keyword} />
      {renderContent()}
    </div>
  );
}
