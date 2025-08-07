import Breadcrumb from "@/components/(with-side-bar)/library/breadcrumb";
import CategoryList from "@/components/(with-side-bar)/library/category-list";
import KnowledgeList from "@/components/(with-side-bar)/library/knowledge-list";
import TagList from "@/components/(with-side-bar)/library/tag-list";
import type { LibraryProps } from "@/types/library";

interface LibraryPageProps {
  category: string;
  tag: string;
}

const libraryData: LibraryProps[] = [
  {
    name: "기술",
    tagCount: 2,
    knowledgeCount: 2,
    tags: [
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
    tagCount: 0,
    knowledgeCount: 0,
    tags: [],
  },
];

export default function LibraryPage({ category, tag }: LibraryPageProps) {
  const currentLevel = tag ? "knowledge" : category ? "tag" : "category";

  const tags = category ? libraryData.find((item) => item.name === category)?.tags || [] : [];
  const knowledges = tag ? tags.find((item) => item.name === tag)?.knowledge || [] : [];

  const renderContent = () => {
    switch (currentLevel) {
      case "category":
        return <CategoryList categories={libraryData} />;
      case "tag":
        return <TagList category={category} tags={tags} />;
      case "knowledge":
        return <KnowledgeList tag={tag} knowledges={knowledges} />;
      default:
        return <CategoryList categories={libraryData} />;
    }
  };

  return (
    <div>
      <Breadcrumb currentLevel={currentLevel} currentCategory={category} currentTag={tag} />
      {renderContent()}
    </div>
  );
}
