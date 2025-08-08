import { cn } from "@repo/ui/utils/cn";
import { Handle, Position, useConnection } from "@xyflow/react";

export default function CustomNode({ id }: { id: string }) {
  const connection = useConnection();

  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  const isSource = connection.inProgress && connection.fromNode.id === id;

  const label = isTarget ? "여기에 연결" : isSource ? "연결 중..." : "드래그하여 연결";

  return (
    <div
      className={cn(
        "bg-card border-border group min-w-[200px] rounded-2xl border p-6 shadow-lg backdrop-blur-sm transition-all duration-200",
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

      <div className="text-muted-foreground text-center text-sm font-medium">{label}</div>
    </div>
  );
}
