import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROUTES: Record<string, string> = {
  SANDER: '/sander',
  SELDA: '/selda',
  SVEIN: '/agent',
  VARDEN26: '/finale',
};

export default function Home() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const upper = code.trim().toUpperCase();
    const route = ROUTES[upper];
    if (route) {
      navigate(route);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 gap-8">
      {/* Logo / Piip */}
      <div className="flex flex-col items-center gap-4">
        <img
          src="/assets/piip/piip_and_bunny.png"
          alt="Piip"
          className="w-32 h-32 object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <h1 className="font-pixel text-mc-yellow text-sm text-center leading-relaxed">
          PÅSKE-<br/>DETEKTIVENE
        </h1>
        <p className="font-pixel text-gray-400 text-xs text-center leading-relaxed">
          2026
        </p>
      </div>

      {/* Intro */}
      <div className="max-w-xs text-center">
        <p className="font-pixel text-white text-xs leading-relaxed">
          Hei, detektiv! Tast inn koden din for å starte oppdraget.
        </p>
      </div>

      {/* Kodefelt */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder="KODE HER"
          maxLength={10}
          className={`bg-mc-dark border-2 rounded px-4 py-4 font-pixel text-xs text-white text-center placeholder-gray-600 outline-none transition-colors ${
            error ? 'border-red-500' : 'border-gray-600 focus:border-mc-yellow'
          }`}
        />
        {error && (
          <p className="font-pixel text-red-400 text-xs text-center">
            Ugyldig kode. Prøv igjen.
          </p>
        )}
        <button
          onClick={handleSubmit}
          className="bg-mc-yellow text-black font-pixel text-xs py-4 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transition-all"
        >
          TAST INN KODE →
        </button>
      </div>

      {/* Footer */}
      <p className="font-pixel text-gray-700 text-xs text-center">
        Piip ønsker lykke til! 🐥
      </p>
    </div>
  );
}
