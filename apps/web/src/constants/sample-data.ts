import type { KnowledgeItemProps, LibraryProps } from "@/types/library";

// 최근 활동용 샘플 데이터
export const recentActivitiesData: KnowledgeItemProps[] = [
  {
    id: 5,
    category: "디자인",
    title: "디자인 시스템에서 AI의 미래",
    thumbnail: "",
    url: "https://example.com/design-ai-future",
    summary:
      "디자인 시스템을 구축하고 유지하는 방식에 인공지능이 어떻게 혁신을 가져오는지에 대한 포괄적인 가이드...",
    memo: "디자인 시스템을 구축하고 유지하는 방식에 인공지능이 어떻게 혁신을 가져오는지에 대한 포괄적인 가이드...",
    tags: ["AI", "디자인"],
  },
  {
    id: 8,
    category: "프로덕트",
    title: "프로덕트 관리 베스트 프랙티스",
    thumbnail: "",
    url: "https://example.com/product-management",
    summary: "성공적인 프로덕트 관리와 팀 협업을 위한 실용적인 방법론과 도구들...",
    memo: "성공적인 프로덕트 관리와 팀 협업을 위한 실용적인 방법론과 도구들...",
    tags: ["프로덕트", "관리"],
  },
  {
    id: 6,
    category: "디자인",
    title: "사용자 경험 설계 아이디어",
    thumbnail: "",
    url: "https://example.com/ux-design-ideas",
    summary: "다음 프로젝트에서 적용할 수 있는 혁신적인 UX 패턴과 인터랙션 아이디어들...",
    memo: "다음 프로젝트에서 적용할 수 있는 혁신적인 UX 패턴과 인터랙션 아이디어들...",
    tags: ["UX", "디자인"],
  },
];

// 라이브러리용 샘플 데이터
export const libraryData: LibraryProps[] = [
  {
    name: "기술",
    tagCount: 2,
    knowledgeCount: 4,
    tags: [
      {
        name: "AI",
        knowledge: [
          {
            id: 1,
            category: "기술",
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
            category: "기술",
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
            category: "개발",
            title: "React Hooks 완벽 가이드",
            thumbnail: "",
            url: "https://velog.io",
            summary: "React Hooks의 모든 기능과 사용법에 대한 상세한 가이드",
            memo: "React Hooks의 모든 기능과 사용법에 대한 상세한 가이드",
            tags: ["React", "Hooks", "개발"],
          },
          {
            id: 4,
            category: "개발",
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
    tagCount: 1,
    knowledgeCount: 3,
    tags: [
      {
        name: "UX/UI",
        knowledge: [
          {
            id: 5,
            category: "디자인",
            title: "디자인 시스템에서 AI의 미래",
            thumbnail: "",
            url: "https://example.com/design-ai-future",
            summary:
              "디자인 시스템을 구축하고 유지하는 방식에 인공지능이 어떻게 혁신을 가져오는지에 대한 포괄적인 가이드...",
            memo: "디자인 시스템을 구축하고 유지하는 방식에 인공지능이 어떻게 혁신을 가져오는지에 대한 포괄적인 가이드...",
            tags: ["AI", "디자인"],
          },
          {
            id: 6,
            category: "디자인",
            title: "사용자 경험 설계 아이디어",
            thumbnail: "",
            url: "https://example.com/ux-design-ideas",
            summary: "다음 프로젝트에서 적용할 수 있는 혁신적인 UX 패턴과 인터랙션 아이디어들...",
            memo: "다음 프로젝트에서 적용할 수 있는 혁신적인 UX 패턴과 인터랙션 아이디어들...",
            tags: ["UX", "디자인"],
          },
          {
            id: 7,
            category: "디자인",
            title: "모던 UI 컴포넌트 디자인",
            thumbnail: "",
            url: "https://example.com/modern-ui-components",
            summary: "현대적인 UI 컴포넌트를 디자인하는 방법과 베스트 프랙티스...",
            memo: "현대적인 UI 컴포넌트를 디자인하는 방법과 베스트 프랙티스...",
            tags: ["UI", "컴포넌트", "디자인"],
          },
        ],
      },
    ],
  },
  {
    name: "프로덕트",
    tagCount: 1,
    knowledgeCount: 1,
    tags: [
      {
        name: "관리",
        knowledge: [
          {
            id: 8,
            category: "프로덕트",
            title: "프로덕트 관리 베스트 프랙티스",
            thumbnail: "",
            url: "https://example.com/product-management",
            summary: "성공적인 프로덕트 관리와 팀 협업을 위한 실용적인 방법론과 도구들...",
            memo: "성공적인 프로덕트 관리와 팀 협업을 위한 실용적인 방법론과 도구들...",
            tags: ["프로덕트", "관리"],
          },
        ],
      },
    ],
  },
];
