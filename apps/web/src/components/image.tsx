import NextImage, { type ImageProps } from "next/image";

const DEFAULT_IMAGE = "/static/logo.png";

export default function Image({ src, alt, ...props }: ImageProps) {
  return (
    <NextImage
      src={src || DEFAULT_IMAGE}
      alt={alt}
      {...props}
      onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
    />
  );
}
