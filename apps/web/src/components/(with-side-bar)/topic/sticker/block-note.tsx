"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";

import { uploadImage } from "@/services/image";
import { defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteSchema } from "@blocknote/core";
import { ko } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

import ToggleBlock from "./toggle-block";

const blockNoteSchema = BlockNoteSchema.create({
  blockSpecs: {
    heading: defaultBlockSpecs.heading,
    paragraph: defaultBlockSpecs.paragraph,
    numberedListItem: defaultBlockSpecs.numberedListItem,
    quote: defaultBlockSpecs.quote,
    bulletListItem: defaultBlockSpecs.bulletListItem,
    checkListItem: defaultBlockSpecs.checkListItem,
    codeBlock: defaultBlockSpecs.codeBlock,
    table: defaultBlockSpecs.table,
    image: defaultBlockSpecs.image,
    toggleListItem: ToggleBlock(),
  },
});

export default function BlockNote() {
  const editor = useCreateBlockNote({
    schema: blockNoteSchema,
    dictionary: ko,
    uploadFile: uploadImage,
  });

  return (
    <div className="h-full">
      <BlockNoteView className="h-full" editor={editor} />
    </div>
  );
}
