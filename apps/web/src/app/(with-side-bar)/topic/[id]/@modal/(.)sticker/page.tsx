import TopicStickerDetailModal from "@/components/topic/topic-sticker-detail-modal";

import TopicStickerDetail from "../../sticker/page";

interface InterceptedTopicDetailProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    type: string;
  }>;
}

export default async function InterceptedTopicDetail(props: InterceptedTopicDetailProps) {
  const { id } = await props.params;
  const { type } = await props.searchParams;

  return (
    <TopicStickerDetailModal id={id} type={type}>
      <TopicStickerDetail {...props} />
    </TopicStickerDetailModal>
  );
}
