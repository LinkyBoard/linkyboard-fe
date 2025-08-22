import NextImage, { type ImageProps } from "next/image";

const DEFAULT_IMAGE = "/static/logo.png";

function normalizeImageSrc(src: ImageProps["src"]): ImageProps["src"] {
  if (!src) return DEFAULT_IMAGE;

  // 문자열이 아닌 경우 그대로 반환
  if (typeof src !== "string") {
    return src;
  }

  // protocol-relative URL을 https로 변환
  if (src.startsWith("//")) {
    return `https:${src}`;
  }

  return src;
}

export default function Image({ src, alt, ...props }: ImageProps) {
  const normalizedSrc = normalizeImageSrc(src);

  return (
    <NextImage
      src={normalizedSrc}
      alt={alt}
      {...props}
      onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
    />
  );
}
