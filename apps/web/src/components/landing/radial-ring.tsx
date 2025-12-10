import { cn } from "@linkyboard/utils";

interface RadialRingProps {
  size: number;
  ringGap: number;
  className?: string;
}

export default function RadialRing({ size, ringGap, className }: RadialRingProps) {
  // 25씩 줄어들고 원이 총 26개가 나와야됨
  return (
    <div className={cn("z-5 flex items-center justify-center", className)}>
      {Array.from({ length: 26 }).map((_, index) => (
        <div
          key={index}
          className="absolute aspect-square rounded-full border-4 border-white/55"
          style={{
            width: `${size - index * ringGap}px`,
            height: `${size - index * ringGap}px`,
          }}
        />
      ))}
    </div>
  );
}
