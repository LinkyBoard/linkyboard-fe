import { useMemo } from "react";

import type { ContentTypeOptions } from "@/constants/content";
import { useCreateContent } from "@/lib/tanstack/mutation/topic-content";
import { useGetAllContents } from "@/lib/tanstack/query/topic";
import type { CategoryContentDTO } from "@linkyboard/types";

import SentinelSpinner from "../../common/sentinel-spinner";
import ContentItem from "../library/content-item";

interface ContentListProps {
  query: string;
  type: ContentTypeOptions;
  id: string;
}

export default function AddContentList({ query, id, type }: ContentListProps) {
  const {
    data: contents,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllContents(type);
  const { mutateAsync: createContent } = useCreateContent(id);

  const filteredContents = useMemo(() => {
    return contents.filter((content) => content.title.toLowerCase().includes(query.toLowerCase()));
  }, [contents, query]);

  const onAddContent = async (content: CategoryContentDTO) => {
    await createContent({
      topicId: id,
      contentId: content.id,
      posX: 0,
      posY: 0,
    });
  };

  return (
    <div className="flex h-[calc(100%-120px)] flex-col gap-3 overflow-y-auto p-4">
      {filteredContents.length === 0 ? (
        <p className="text-muted-foreground text-center">저장된 콘텐츠가 없어요</p>
      ) : (
        filteredContents.map((item) => (
          <ContentItem
            draggable
            key={`${item.id}-content-item`}
            item={item}
            onClick={() => onAddContent(item)}
          />
        ))
      )}
      <SentinelSpinner
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
