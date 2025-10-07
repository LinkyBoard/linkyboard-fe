import TopicDetail from "@/app/(with-side-bar)/topic/[id]/page";
import Modal from "@/components/topic/modal";

interface InterceptedTopicDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterceptedTopicDetail(props: InterceptedTopicDetailProps) {
  const { id } = await props.params;

  return (
    <Modal id={id}>
      <TopicDetail {...props} />
    </Modal>
  );
}
