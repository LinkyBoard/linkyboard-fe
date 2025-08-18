import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  useDialog,
} from "@repo/ui/components/dialog";

import { Sparkles } from "lucide-react";

import { Button } from "../ui/button";

interface SummarizeDialogProps {
  selectedNodeIds: number[];
}

function SummarizeDialogContent({ selectedNodeIds }: SummarizeDialogProps) {
  const { close } = useDialog();
  const [prompt, setPrompt] = useState("");

  const onSummarize = async () => {
    if (!prompt.trim()) return;

    // TODO: 요약 API 연동
    console.log("요약 요청:", { selectedNodeIds, prompt });
    close();
  };

  return (
    <DialogContent>
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-lg font-semibold">요약</h2>
          <p className="text-muted-foreground text-sm">선택한 콘텐츠를 어떻게 요약하시겠습니까?</p>
        </div>
        <div>
          <label className="text-sm font-medium">요약 프롬프트</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 선택된 콘텐츠들의 핵심 내용을 요약해주세요"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <DialogClose>취소</DialogClose>
          </Button>
          <Button onClick={onSummarize} disabled={!prompt.trim()}>
            요약하기
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function SummarizeDialog({ selectedNodeIds }: SummarizeDialogProps) {
  return (
    <Dialog>
      <Button className="flex items-center gap-2" asChild>
        <DialogTrigger>
          <Sparkles size={16} />
          요약하기
        </DialogTrigger>
      </Button>
      <SummarizeDialogContent selectedNodeIds={selectedNodeIds} />
    </Dialog>
  );
}
