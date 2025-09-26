import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@linkyboard/components";
import { cn } from "@linkyboard/utils";
import type { Editor } from "@tiptap/react";

import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";

interface EditTopicTooltipListProps {
  editor: Editor;
}

export default function EditTopicTooltipList({ editor }: EditTopicTooltipListProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1 rounded-lg border bg-gray-50 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn("size-8 p-0")}
            >
              <Heading1 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>제목 1 (H1)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn("size-8 p-0")}
            >
              <Heading2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>제목 2 (H2)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn("size-8 p-0")}
            >
              <Heading3 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>제목 3 (H3)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              className={cn("size-8 p-0")}
            >
              <Heading4 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>제목 4 (H4)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn("size-8 p-0")}
            >
              <Bold size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>굵게 (Ctrl+B)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn("size-8 p-0")}
            >
              <Italic size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>기울임 (Ctrl+I)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn("size-8 p-0")}
            >
              <Strikethrough size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>취소선</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn("size-8 p-0")}
            >
              <Code size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>인라인 코드</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={cn("size-8 p-0")}
            >
              <Code size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>코드 블록</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn("size-8 p-0")}
            >
              <List size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>목록</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn("size-8 p-0")}
            >
              <ListOrdered size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>순서 목록</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn("size-8 p-0")}
            >
              <Quote size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>인용문</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={cn("size-8 p-0")}
            >
              <Highlighter size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>하이라이트</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
