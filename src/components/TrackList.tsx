import type { MusicBrainzTrack } from "../types/musicbrainz";

interface TrackListProps {
  tracks: MusicBrainzTrack[];
  fontSize?: number;
}

export function TrackList({ tracks, fontSize = 14 }: TrackListProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-normal tracking-wide text-center" style={{ fontSize }}>
      {tracks.map((track, i) => (
        <span key={i} className="whitespace-nowrap">
          {track.title}
          {i < tracks.length - 1 && " · "}
        </span>
      ))}
    </div>
  );
}

