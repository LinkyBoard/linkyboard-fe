import { useState } from "react";

import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useSummarizeTopicContent } from "@/lib/tanstack/mutation/custom-sticker";
import { useGetAiModels } from "@/lib/tanstack/query/custom-sticker";
import { useStickerStore } from "@/lib/zustand/sticker-store";
import type { AIModelDTO } from "@/models/custom-sticker";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  promisedToast,
  useDialog,
} from "@linkyboard/components";
import { useOutsideClick } from "@linkyboard/hooks";
import { cn } from "@linkyboard/utils";

import { ChevronDown, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";

import { summarizeSchema, type SummarizeSchemaType } from "../../schemas/summarize";

interface SummarizeDialogProps {
  topicId: string;
  selectedNodeIds: string[];
  setSelectedNodeIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const DEFAULT_VALUES = {
  modelName: "",
  alias: "",
  prompt: "",
};

function SummarizeDialogContent({
  topicId,
  selectedNodeIds,
  setSelectedNodeIds,
}: SummarizeDialogProps) {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const { setEditingSticker, setShowEditStickerSidebar } = useStickerStore();

  const [dropdownRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsModelDropdownOpen(false);
  });
  const { close } = useDialog();

  const { data } = useGetAiModels();
  const { mutateAsync, isPending } = useSummarizeTopicContent();

  const { register, handleSubmit, watch, setValue, reset } = useForm<SummarizeSchemaType>({
    resolver: zodResolver(summarizeSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onClose = () => {
    close();
    reset();
  };

  const selectedContentIds = selectedNodeIds.map((id) => Number(id.split("-")[1]));
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
    const promise = mutateAsync(
      {
        topicId,
        selectedContentIds,
        requirements: data.prompt,
        modelAlias: data.alias,
      },
      {
        onSuccess: (data) => {
          invalidateQueries([TOPIC.GET_TOPIC_BY_ID, topicId]);
          setEditingSticker({
            ...data.result,
            content: data.result.draftMd,
            type: "custom_sticker",
          });
          setShowEditStickerSidebar(true);
          reset();
          setSelectedNodeIds([]);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
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
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-ring flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  {data ? (
                    data?.map((item) => (
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
                    ))
                  ) : (
                    <div className="text-muted-foreground w-full px-3 py-2">
                      모델을 불러오는 중입니다...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">요약 프롬프트</label>
            <textarea
              {...register("prompt")}
              placeholder="예: 선택된 콘텐츠들의 핵심 내용을 요약해주세요"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "요약 중..." : "요약"}
            </Button>
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
