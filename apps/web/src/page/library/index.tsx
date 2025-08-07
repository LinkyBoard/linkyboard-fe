import Breadcrumb from "@/components/(with-side-bar)/library/breadcrumb";
import CategoryList from "@/components/(with-side-bar)/library/category-list";
import KnowledgeList from "@/components/(with-side-bar)/library/knowledge-list";
import type { LibraryProps } from "@/types/library";

interface LibraryPageProps {
  category: string;
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
            thumbnail:
              "https://velog.velcdn.com/images/brince/post/13ac5797-730b-43f8-a963-1eea51e05153/image.png",
            url: "https://velog.io",
            summary: "머신러닝의 기본 개념과 알고리즘에 대한 포괄적인 가이드",
            memo: "머신러닝의 기본 개념과 알고리즘에 대한 포괄적인 가이드",
            tags: ["머신러닝", "알고리즘", "AI"],
          },
          {
            id: 2,
            title: "딥러닝 프레임워크 비교",
            thumbnail: "",
            url: "https://velog.io",
            summary: "TensorFlow, PyTorch, Keras 등 주요 딥러닝 프레임워크 분석",
            memo: "TensorFlow, PyTorch, Keras 등 주요 딥러닝 프레임워크 분석",
            tags: ["딥러닝", "프레임워크", "AI"],
          },
        ],
      },
      {
        name: "개발",
        knowledge: [
          {
            id: 3,
            title: "React Hooks 완벽 가이드",
            thumbnail: "",
            url: "https://velog.io",
            summary: "React Hooks의 모든 기능과 사용법에 대한 상세한 가이드",
            memo: "React Hooks의 모든 기능과 사용법에 대한 상세한 가이드",
            tags: ["React", "Hooks", "개발"],
          },
          {
            id: 4,
            title: "TypeScript 베스트 프랙티스",
            thumbnail: "",
            url: "https://velog.io",
            summary: "TypeScript를 효과적으로 사용하는 방법과 팁들",
            memo: "TypeScript를 효과적으로 사용하는 방법과 팁들",
            tags: ["TypeScript", "개발", "타입"],
          },
        ],
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

export default function LibraryPage({ category }: LibraryPageProps) {
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
        return <KnowledgeList knowledges={allKnowledges} category={category} />;
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
