import { useState } from "react";

import { useStickerStore } from "@/lib/zustand/sticker-store";
import { useTopicStore } from "@/lib/zustand/topic";
import { AIModelDTO } from "@/models/custom-sticker";
import { promisedToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTrigger, useDialog } from "@repo/ui/components/dialog";
import { useOutsideClick } from "@repo/ui/hooks/use-outside-click";
import { cn } from "@repo/ui/utils/cn";

import { ChevronDown, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";

import { summarizeSchema, type SummarizeSchemaType } from "../../schemas/summarize";
import { Button } from "../ui/button";

interface SummarizeDialogProps {
  topicId: string;
  selectedNodeIds: string[];
  setSelectedNodeIds: React.Dispatch<React.SetStateAction<string[]>>;
  addNodeToFlow: (type: string, item: any) => void;
  addEdgesToFlow: (newEdges: any[]) => void;
}

const DEFAULT_VALUES = {
  modelName: "",
  alias: "",
  prompt: "",
};

const aiModels = [
  {
    alias: "GPT-4o Mini",
    modelName: "gpt-4o-mini",
  },
];

function SummarizeDialogContent({
  selectedNodeIds,
  setSelectedNodeIds,
  addNodeToFlow,
  addEdgesToFlow,
}: SummarizeDialogProps) {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const { setEditingSticker, setShowEditStickerSidebar } = useStickerStore();

  const [dropdownRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsModelDropdownOpen(false);
  });
  const { close } = useDialog();

  const { register, handleSubmit, watch, setValue, reset } = useForm<SummarizeSchemaType>({
    resolver: zodResolver(summarizeSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onClose = () => {
    close();
    reset();
  };

  const watchedModel = watch("modelName");

  const onModelSelect = (e: React.MouseEvent<HTMLButtonElement>, model: AIModelDTO) => {
    e.stopPropagation();
    setValue("modelName", model.modelName);
    setValue("alias", model.alias);
    setIsModelDropdownOpen(false);
  };

  const onToggleModelDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsModelDropdownOpen(!isModelDropdownOpen);
  };

  const onSummarize = handleSubmit(async (data) => {
    close();
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        const id = new Date().getTime();
        const title = "프론트엔드 개발 핵심 기술 요약";
        const content = `# 프론트엔드 개발 핵심 기술 요약

## React 18 주요 기능
- **Concurrent Features**: 동시성 기능으로 사용자 경험 향상
- **Automatic Batching**: 자동 배칭으로 성능 최적화
- **Suspense for Data Fetching**: 데이터 페칭을 위한 서스펜스

## TypeScript 활용
- **타입 안정성**: 런타임 에러 방지
- **개발자 경험**: 더 나은 IDE 지원과 자동완성
- **코드 품질**: 명확한 인터페이스 정의

## Next.js 15 마이그레이션
- **App Router**: 새로운 라우팅 시스템 활용
- **서버 컴포넌트**: 성능 최적화를 위한 서버 사이드 렌더링
- **스트리밍**: 점진적 로딩으로 사용자 경험 개선

## 실무 적용 포인트
1. 점진적 마이그레이션 전략
2. 성능 모니터링 도구 활용
3. 팀 내 코딩 컨벤션 정립
4. 타입 안정성과 개발자 경험 균형

## 요약 요구사항
${data.prompt || "기본 요약"}

## 사용된 AI 모델
GPT-4o-mini`;
        addNodeToFlow("custom_sticker", {
          id,
          title,
          content,
        });
        setEditingSticker({
          id,
          title,
          content,
          type: "custom_sticker",
        });
        const edges = selectedNodeIds.map((nodeId) => ({
          id: `xy-edge__${nodeId}top-custom_sticker-${id}bottom-target`,
          source: nodeId,
          sourceHandle: "top",
          target: `custom_sticker-${id}`,
          targetHandle: "bottom-target",
        }));
        addEdgesToFlow(edges);
        setShowEditStickerSidebar(true);
        setSelectedNodeIds([]);
        resolve(true);
      }, 1000);
    });
    promisedToast(promise, {
      loading: "요약 중...",
      success: "요약이 완료되었어요.",
      error: "요약에 실패했어요.",
    });
  });

  return (
    <DialogContent>
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-lg font-semibold">요약</h2>
          <p className="text-muted-foreground text-sm">선택한 콘텐츠를 어떻게 요약하시겠습니까?</p>
        </div>
        <form onSubmit={onSummarize} className="space-y-4">
          <div>
            <label className="mb-2 block text-base font-medium">AI 모델</label>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={onToggleModelDropdown}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-ring flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-base focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <p className={cn(watchedModel ? "text-foreground" : "text-muted-foreground")}>
                  {watchedModel || "AI 모델을 선택해주세요"}
                </p>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isModelDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isModelDropdownOpen && (
                <div className="bg-background absolute z-10 mt-5 max-h-52 w-full overflow-y-auto rounded-md border shadow-lg">
                  {aiModels.map((item) => (
                    <button
                      key={item.alias}
                      type="button"
                      onClick={(e) => onModelSelect(e, item)}
                      className={cn(
                        "hover:bg-accent text-foreground block w-full px-3 py-2 text-left",
                        watchedModel === item.alias && "bg-accent text-accent-foreground"
                      )}
                    >
                      {item.modelName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">요약 프롬프트</label>
            <textarea
              {...register("prompt")}
              placeholder="예: 선택된 콘텐츠들의 핵심 내용을 요약해주세요"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">요약</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}

export default function SummarizeDialog(props: SummarizeDialogProps) {
  return (
    <Dialog>
      <Button className="flex items-center gap-2" asChild>
        <DialogTrigger>
          <Sparkles size={16} />
          요약
        </DialogTrigger>
      </Button>
      <SummarizeDialogContent {...props} />
    </Dialog>
  );
}
