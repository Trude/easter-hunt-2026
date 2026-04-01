interface SpotifyEmbedProps {
  trackId: string;
}

// Viser kun play-knappen fra Spotify-embedden — tittel og artist skjules
// slik at spørsmålet om sangnavn/artist ikke røpes visuelt.
export default function SpotifyEmbed({ trackId }: SpotifyEmbedProps) {
  return (
    <div className="flex flex-col items-center my-3 gap-2">
      {/* Container klippes til ~64px bred og 64px høy for å vise
          kun albumcover + play-knapp fra Spotify compact embed */}
      <div
        className="rounded-lg overflow-hidden border border-gray-700"
        style={{ width: 64, height: 64, position: 'relative' }}
      >
        <iframe
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
          style={{
            width: 360,
            height: 80,
            position: 'absolute',
            top: -8,
            left: 0,
            border: 'none',
          }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
      <p className="font-pixel text-xs text-gray-400 text-center">
        🎵 Trykk play og hør på sangen
      </p>
    </div>
  );
}
