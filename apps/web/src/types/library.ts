export interface KnowledgeItemProps {
  id: number;
  title: string;
  type: string;
  description: string;
  tags: string[];
  date: string;
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
