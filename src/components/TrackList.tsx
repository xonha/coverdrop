import type { MusicBrainzTrack } from "../types/musicbrainz";

interface TrackListProps {
  tracks: MusicBrainzTrack[];
}

export function TrackList({ tracks }: TrackListProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-normal text-sm tracking-wide text-center">
      {tracks.map((track, i) => (
        <span key={i} className="whitespace-nowrap">
          {track.title}
          {i < tracks.length - 1 && " · "}
        </span>
      ))}
    </div>
  );
}

