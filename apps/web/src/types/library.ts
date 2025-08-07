export interface KnowledgeItemProps {
  id: number;
  category: string;
  thumbnail: string;
  title: string;
  url: string;
  summary: string;
  memo: string;
  tags: string[];
}

export interface TagProps {
  name: string;
  knowledge: KnowledgeItemProps[];
}

export interface CategoryProps {
  name: string;
  tags: TagProps[];
}

export interface LibraryProps {
  name: string;
  tags: TagProps[];
  knowledgeCount: number;
  tagCount: number;
}
