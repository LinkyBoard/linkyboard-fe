export interface KnowledgeItemProps {
  id: number;
  title: string;
  type: string;
  description: string;
  tags: string[];
  date: string;
}

export interface KeywordProps {
  name: string;
  knowledge: KnowledgeItemProps[];
}

export interface CategoryProps {
  name: string;
  keywords: KeywordProps[];
}

export interface LibraryProps {
  name: string;
  keywords: KeywordProps[];
  knowledgeCount: number;
  keywordCount: number;
}
