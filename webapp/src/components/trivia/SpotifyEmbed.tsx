interface SpotifyEmbedProps {
  trackId: string;
}

export default function SpotifyEmbed({ trackId }: SpotifyEmbedProps) {
  return (
    <div className="w-full my-3">
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
      />
      <p className="text-xs text-gray-400 mt-1 text-center">
        🎵 Hør på sangen og svar på spørsmålet
      </p>
    </div>
  );
}
