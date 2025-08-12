import Image from "next/image";

import { ContentItemProps } from "@/types/library";
import { cn } from "@repo/ui/utils/cn";
import { Handle, NodeProps, Position, useConnection } from "@xyflow/react";

import { Edit, Lightbulb, Link, Trash2, X } from "lucide-react";

import { Button } from "../ui/button";

interface NodeData {
  nodeContent: "topic" | "content";
  item: ContentItemProps;
}

const stickerStyle = {
  topic: "from-primary bg-gradient-to-br to-blue-600 text-white",
  content: "bg-card hover:border-primary border-border border",
};

function TopicSticker({ item }: { item: ContentItemProps }) {
  const onEditTopic = () => {
    console.log("edit");
  };
  const onDeleteTopic = () => {
    console.log("delete");
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
          <Lightbulb size={24} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-white/20 text-white hover:bg-white/30"
            onClick={onEditTopic}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-white/20 text-white hover:bg-white/30"
            onClick={onDeleteTopic}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-2xl leading-tight font-bold">{item.title}</h2>
        <p className="text-lg leading-relaxed opacity-90">{item.summary}</p>
      </div>
    </>
  );
}

function ContentSticker({ item }: { item: ContentItemProps }) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          {item?.thumbnail ? (
            <div className="relative size-12 overflow-hidden rounded-lg border">
              <Image src={item.thumbnail} alt="페이지 썸네일" fill className="object-cover" />
            </div>
          ) : (
            <div className="from-primary to-chart-2 flex aspect-square size-12 items-center justify-center rounded-lg bg-gradient-to-r">
              <Link className="size-6 text-white" />
            </div>
          )}
          <div className="line-clamp-1 flex-1 text-lg font-semibold">{item.title}</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-muted text-muted-foreground hover:bg-destructive h-8 w-8 hover:text-white"
          onClick={() => {}}
        >
          <X size={16} />
        </Button>
      </div>

      <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{item.summary}</p>

      <div className="flex flex-wrap gap-1">
        {item.tags.slice(0, 3).map((tag: string) => (
          <span key={tag} className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
            {tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
            +{item.tags.length - 3}
          </span>
        )}
      </div>
    </>
  );
}

export default function CustomNode(props: NodeProps) {
  const nodeData = props.data as unknown as NodeData;

  const connection = useConnection();

  const isTarget = connection.inProgress && connection.fromNode.id !== props.id;
  const isSource = connection.inProgress && connection.fromNode.id === props.id;

  const label = isTarget ? "여기에 연결" : isSource ? "연결 중..." : "드래그하여 연결";
  const stickerClass = stickerStyle[nodeData.nodeContent];

  return (
    <div
      className={cn(
        "group max-w-[450px] min-w-[350px] rounded-2xl p-6 shadow-lg transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl",
        stickerClass,
        isTarget && "border-primary",
        isSource && "border-muted-foreground/50"
      )}
    >
      {/* Source Handles - 연결 시작점 */}
      {!connection.inProgress && (
        <>
          <Handle
            className={cn("customHandle", isSource && "connecting")}
            position={Position.Left}
            type="source"
            id="left"
          />
          <Handle
            className={cn("customHandle", isSource && "connecting")}
            position={Position.Right}
            type="source"
            id="right"
          />
          <Handle
            className={cn("customHandle", isSource && "connecting")}
            position={Position.Top}
            type="source"
            id="top"
          />
          <Handle
            className={cn("customHandle", isSource && "connecting")}
            position={Position.Bottom}
            type="source"
            id="bottom"
          />
        </>
      )}

      {/* Target Handles - 연결 종료점 */}
      {(!connection.inProgress || isTarget) && (
        <>
          <Handle
            className={cn("customHandle", isTarget && "connecting")}
            position={Position.Left}
            type="target"
            id="left-target"
            isConnectableStart={false}
          />
          <Handle
            className={cn("customHandle", isTarget && "connecting")}
            position={Position.Right}
            type="target"
            id="right-target"
            isConnectableStart={false}
          />
          <Handle
            className={cn("customHandle", isTarget && "connecting")}
            position={Position.Top}
            type="target"
            id="top-target"
            isConnectableStart={false}
          />
          <Handle
            className={cn("customHandle", isTarget && "connecting")}
            position={Position.Bottom}
            type="target"
            id="bottom-target"
            isConnectableStart={false}
          />
        </>
      )}

      {nodeData.nodeContent === "topic" ? (
        <TopicSticker item={nodeData.item} />
      ) : (
        <ContentSticker item={nodeData.item} />
      )}
    </div>
  );
}
