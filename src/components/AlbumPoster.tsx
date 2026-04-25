import { useState } from "react";
import type {
  MusicBrainzRelease,
  MusicBrainzTrack,
} from "../types/musicbrainz";
import { PosterBackground } from "./PosterBackground";
import { PosterSidebar } from "./PosterSidebar";
import { TrackList } from "./TrackList";

interface AlbumPosterProps {
  album: MusicBrainzRelease;
  coverUrl: string;
  tracks: MusicBrainzTrack[];
  size?: number;
  coverContrast?: number;
  bgColor?: string;
  bgOpacity?: number;
  textColor?: string;
  titleSize?: number;
  artistSize?: number;
  tracksSize?: number;
}

export function AlbumPoster({
  album,
  coverUrl,
  tracks,
  size = 600,
  coverContrast: externalContrast,
  bgColor: externalBgColor,
  bgOpacity: externalBgOpacity,
  textColor: externalTextColor,
  titleSize: externalTitleSize,
  artistSize: externalArtistSize,
  tracksSize: externalTracksSize,
}: AlbumPosterProps) {
  const [coverContrast, setCoverContrast] = useState(externalContrast ?? 0);
  const [bgColor, setBgColor] = useState(externalBgColor ?? "#000000");
  const [bgOpacity, setBgOpacity] = useState(externalBgOpacity ?? 50);
  const [textColor, setTextColor] = useState(externalTextColor ?? "#ffffff");
  const [titleSize, setTitleSize] = useState(externalTitleSize ?? 24);
  const [artistSize, setArtistSize] = useState(externalArtistSize ?? 16);
  const [tracksSize, setTracksSize] = useState(externalTracksSize ?? 14);

  return (
    <div
      className="relative"
      style={{ width: size + 200, height: size * 1.414 }}
    >
      <div
        className="relative overflow-hidden flex flex-col items-center"
        style={{
          width: size,
          height: size * 1.414,
          fontFamily: "Georgia, serif",
          color: textColor,
        }}
      >
        <PosterBackground
          coverUrl={coverUrl}
          bgColor={bgColor}
          bgOpacity={bgOpacity}
        />
        <div className="z-1 p-12">
          <div className="w-full flex items-center justify-center">
            <img
              src={coverUrl}
              alt={album.title}
              className="h-auto object-cover pb-6"
              style={{ filter: `contrast(${100 + coverContrast}%)` }}
            />
          </div>

          <div className="w-full flex flex-col overflow-hidden">
            <h1 className="font-medium text-center" style={{ fontSize: titleSize }}>{album.title}</h1>
            <p className="text-center mt-2" style={{ fontSize: artistSize }}>{album.artistCredit?.[0]?.name}</p>
            <div className="mt-4">
              <TrackList tracks={tracks} fontSize={tracksSize} />
            </div>
          </div>
        </div>
      </div>

      <PosterSidebar
        sections={[
          {
            label: "Cover Contrast",
            value: coverContrast,
            onChange: (v) => setCoverContrast(v as number),
            min: -100,
            max: 100,
          },
          {
            label: "Background Color",
            value: bgColor,
            onChange: (v) => setBgColor(v as string),
          },
          {
            label: "Background Opacity",
            value: bgOpacity,
            onChange: (v) => setBgOpacity(v as number),
            min: 0,
            max: 100,
          },
          {
            label: "Text Color",
            value: textColor,
            onChange: (v) => setTextColor(v as string),
          },
          {
            label: "Title Size",
            value: titleSize,
            onChange: (v) => setTitleSize(v as number),
            min: 8,
            max: 72,
            type: "number",
          },
          {
            label: "Artist Size",
            value: artistSize,
            onChange: (v) => setArtistSize(v as number),
            min: 8,
            max: 72,
            type: "number",
          },
          {
            label: "Tracks Size",
            value: tracksSize,
            onChange: (v) => setTracksSize(v as number),
            min: 8,
            max: 72,
            type: "number",
          },
        ]}
      />
    </div>
  );
}
