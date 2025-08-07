import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  useDialog,
} from "@repo/ui/components/dialog";

import { Tag } from "lucide-react";

function AddTagForm() {
  const { close } = useDialog();

  const onCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;

    console.log(name);

    // TODO: API 요청으로 바꾸기
    // 성공 시 dialog 닫기
    close();
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">새 키워드 생성</h2>
        <p className="text-muted-foreground">새로운 키워드를 생성하고 관리하세요</p>
      </div>
      <form onSubmit={onCreateTag}>
        <div className="mb-4">
          <label className="mb-2 block font-medium">키워드 이름</label>
          <Input type="text" name="name" placeholder="키워드 이름을 입력하세요" required />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <DialogClose>취소</DialogClose>
          </Button>
          <Button type="submit">생성</Button>
        </div>
      </form>
    </>
  );
}

export default function AddTagDialog() {
  return (
    <Dialog>
      <Button variant="default" className="flex items-center gap-2" asChild>
        <DialogTrigger>
          <Tag size={16} />새 키워드
        </DialogTrigger>
      </Button>
      <DialogContent>
        <AddTagForm />
      </DialogContent>
    </Dialog>
  );
}
