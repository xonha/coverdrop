import { useState } from "react";
import type {
  MusicBrainzRelease,
  MusicBrainzTrack,
} from "../types/musicbrainz";

interface AlbumPosterProps {
  album: MusicBrainzRelease;
  coverUrl: string;
  tracks: MusicBrainzTrack[];
  size?: number;
}

export function AlbumPoster({
  album,
  coverUrl,
  tracks,
  size = 600,
}: AlbumPosterProps) {
  const [contrast, setContrast] = useState(0);
  const [bgContrast, setBgContrast] = useState(70);
  const [bgColor, setBgColor] = useState("#000000");

  return (
    <div
      className="relative"
      style={{ width: size + 200, height: size * 1.414 }}
    >
      <div
        className="relative text-white overflow-hidden flex flex-col items-center"
        style={{
          width: size,
          height: size * 1.414,
          fontFamily: "Georgia, serif",
        }}
      >
        <PosterBackground
          coverUrl={coverUrl}
          bgColor={bgColor}
          bgOpacity={bgContrast}
        />
        <div className="z-1 p-12">
          <div className="w-full flex items-center justify-center">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={album.title}
                className="h-auto object-cover pb-6"
                style={{ filter: `contrast(${100 + contrast}%)` }}
              />
            ) : (
              <IconAlbumEmpty />
            )}
          </div>

          <div className="w-full flex flex-col overflow-hidden">
            <span className="text-2xl font-medium text-center">
              {album.title}
            </span>
            <span className="text-2xl font-medium text-center pb-6">
              {album.title}
            </span>
            <TrackList tracks={tracks} />
          </div>
        </div>
      </div>

      <PosterSidebar
        sections={[
          {
            label: "Cover Contrast",
            value: contrast,
            onChange: setContrast,
            min: -100,
            max: 100,
          },
          { label: "Background Color", value: bgColor, onChange: setBgColor },
          {
            label: "Background Opacity",
            value: bgContrast,
            onChange: setBgContrast,
            min: 0,
            max: 100,
          },
        ]}
      />
    </div>
  );
}

function PosterSidebar(p: {
  sections: Array<{
    label: string;
    value: number | string;
    onChange: (v: number | string) => void;
    min?: number;
    max?: number;
  }>;
}) {
  return (
    <div className="absolute right-0 top-0 h-full w-48 bg-gray-950/90 flex flex-col p-4 gap-4 overflow-y-auto">
      {p.sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">{section.label}</span>
          {typeof section.value === "string" ? (
            <input
              type="color"
              value={section.value}
              onChange={(e) => section.onChange(e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          ) : (
            <>
              <input
                type="range"
                min={section.min}
                max={section.max}
                value={section.value}
                onChange={(e) => section.onChange(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-400 text-center">
                {section.value}%
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function TrackList(p: { tracks: MusicBrainzTrack[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-normal text-sm tracking-wide text-center">
      {p.tracks.map((track, i) => (
        <span key={i} className="whitespace-nowrap">
          {track.title}
          {i < p.tracks.length - 1 && " • "}
        </span>
      ))}
    </div>
  );
}

function PosterBackground(p: {
  coverUrl: string;
  bgColor: string;
  bgOpacity: number;
}) {
  if (!p.coverUrl) return null;
  const opacity = p.bgOpacity / 100;
  return (
    <div className="absolute inset-0 z-0">
      <img
        src={p.coverUrl}
        alt=""
        className="w-full h-full object-cover blur-sm scale-105"
      />
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: p.bgColor, opacity }}
      />
    </div>
  );
}

function IconAlbumEmpty() {
  return (
    <div className="w-full aspect-square bg-gray-800 flex items-center justify-center">
      <svg
        className="w-24 h-24 text-gray-600"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    </div>
  );
}
