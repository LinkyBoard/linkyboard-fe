"use client";

import Image from "@/components/common/image";
import { CONTENT_TYPE } from "@/constants/content";
import type { ContentDetailDTO } from "@/models/content";
import { extractYoutubeId } from "@linkyboard/utils";
import { YouTubeEmbed } from "@next/third-parties/google";

export default function ContentWatchMode({
  type,
  url,
  thumbnail,
  title,
  category,
  tags,
  summary,
  memo,
}: ContentDetailDTO) {
  const isYoutube = type === CONTENT_TYPE.YOUTUBE;
  const youtubeId = extractYoutubeId(url || "");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border">
          <Image src={thumbnail || ""} alt="페이지 썸네일" fill className="object-cover" />
        </div>
        <div className="overflow-hidden">
          <h3 className="line-clamp-1 text-2xl font-semibold">{title}</h3>
          <a
            className="text-muted-foreground line-clamp-1 text-base underline"
            href={url}
            target="_blank"
          >
            {url}
          </a>
        </div>
      </div>

      {isYoutube && (
        <div className="aspect-video">
          <YouTubeEmbed
            videoid={youtubeId || ""}
            params="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          />
        </div>
      )}

      <div>
        <h4 className="mb-2 text-lg font-medium">카테고리</h4>
        <p className="text-muted-foreground text-base">{category || "-"}</p>
      </div>

      <div>
        <h4 className="mb-2 text-lg font-medium">태그</h4>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-muted-foreground text-base">-</p>
          ) : (
            tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted text-muted-foreground rounded px-2 py-1 text-base"
              >
                {tag}
              </span>
            ))
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-lg font-medium">요약</h4>
        <p className="text-muted-foreground text-base">{summary || "-"}</p>
      </div>

      <div>
        <h4 className="mb-2 text-lg font-medium">메모</h4>
        <p className="text-muted-foreground text-base">{memo || "-"}</p>
      </div>
    </div>
  );
}
