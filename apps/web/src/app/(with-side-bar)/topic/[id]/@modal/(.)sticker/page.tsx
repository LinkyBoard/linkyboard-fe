import TopicStickerDetailModal from "@/components/(with-side-bar)/topic/sticker/topic-sticker-detail-modal";

import TopicStickerDetail from "../../sticker/page";

interface InterceptedTopicDetailProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    stickerId: string;
  }>;
}

export default async function InterceptedTopicDetail(props: InterceptedTopicDetailProps) {
  const { id } = await props.params;
  const { stickerId } = await props.searchParams;

  return (
    <TopicStickerDetailModal id={id} stickerId={stickerId}>
      <TopicStickerDetail {...props} />
    </TopicStickerDetailModal>
  );
}
