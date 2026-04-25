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
  const artistName =
    album.artistCredit?.[0]?.name ||
    album.artistCredit?.[0]?.artist?.name ||
    "";
  const releaseDate = album.date || "";

  return (
    <div
      className="relative text-black overflow-hidden flex flex-col items-center"
      style={{
        width: size,
        height: size * 1.414,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <PosterBackground coverUrl={coverUrl} />
      <div className="z-1 p-12">
        <div className="w-full flex items-center justify-center">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={album.title}
              className="h-auto object-cover pb-12"
            />
          ) : (
            <IconAlbumEmpty />
          )}
        </div>

        <div className="w-full flex flex-col overflow-hidden">
          <h1 className="text-2xl font-bold leading-tight mb-2 line-clamp-3 text-center">
            {album.title.toUpperCase()}
          </h1>
          <h2 className="text-lg mb-4 text-center">{artistName}</h2>

          {releaseDate && (
            <p className="text-sm mb-4 text-center">Released: {releaseDate}</p>
          )}

          <TrackList tracks={tracks} />
        </div>
      </div>
    </div>
  );
}

function TrackList(p: { tracks: MusicBrainzTrack[] }) {
  return (
    <div className="flex-1 overflow-hidden font-bold text-center">
      {p.tracks.map((track, i) => {
        if (i === p.tracks.length - 1) return track.title;
        return track.title + " · ";
      })}
    </div>
  );
}

function PosterBackground(p: { coverUrl: string }) {
  if (!p.coverUrl) return null;
  return (
    <div className="absolute inset-0 z-0">
      <img
        src={p.coverUrl}
        alt=""
        className="w-full h-full object-cover blur-xl scale-105"
      />
      <div className="absolute inset-0 z-10 bg-black/10 w-full h-full" />
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
