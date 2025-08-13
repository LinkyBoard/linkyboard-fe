export interface TopicDTO {
  id: number;
  title: string;
  content: string;
}

export interface TopicContentDTO {
  id: number;
  topicId: number;
  contentId: number;
  contentTitle: string;
  contentUrl: string;
  contentMemo: string;
  contentSummary: string;
  thumbnail: string;
  tags: string[];
  posX: number;
  posY: number;
}
