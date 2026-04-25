interface PosterBackgroundProps {
  coverUrl: string;
  bgColor: string;
  bgOpacity: number;
}

export function PosterBackground({
  coverUrl,
  bgColor,
  bgOpacity,
}: PosterBackgroundProps) {
  const opacity = bgOpacity / 100;
  return (
    <div className="absolute inset-0 z-0">
      <img
        src={coverUrl}
        alt=""
        className="w-full h-full object-cover blur-sm scale-105"
      />
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: bgColor, opacity }}
      />
    </div>
  );
}

