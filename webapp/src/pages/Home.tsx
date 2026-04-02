import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';

const ROUTES: Record<string, string> = {
  KODEKNEKKEREN: '/sander',
  SPORHUNDEN: '/selda',
  SVEIN: '/agent',
  VARDEN26: '/finale',
  KOMBINER: '/kombiner',
};

export default function Home() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const upper = code.trim().toUpperCase();
    if (upper === 'RESET2026') {
      storage.resetAll();
      setCode('');
      return;
    }
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
      <div className="flex flex-col items-center gap-3">
        <div className="border-4 border-yellow-300 rounded-2xl px-6 py-4 bg-yellow-50/80 shadow-lg">
          <h1 className="font-pixel text-mc-yellow text-sm text-center leading-relaxed">
            PÅSKE-<br/>DETEKTIVENE
          </h1>
        </div>
        <p className="font-pixel text-purple-500 text-xs text-center leading-relaxed">
          2026
        </p>
      </div>

      {/* Intro */}
      <div className="max-w-xs text-center border-2 border-purple-200 rounded-lg px-4 py-3 bg-purple-50/60">
        <p className="font-pixel text-gray-800 text-xs leading-relaxed">
          Hei, detektiv! Tast inn kodenavnet ditt for å komme videre.
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
          maxLength={14}
          className={`bg-white border-2 rounded px-4 py-4 font-pixel text-xs text-gray-800 text-center placeholder-gray-400 outline-none transition-colors ${
            error ? 'border-red-500' : 'border-yellow-300 focus:border-mc-yellow'
          }`}
        />
        {error && (
          <p className="font-pixel text-red-400 text-xs text-center">
            Ugyldig kode. Prøv igjen.
          </p>
        )}
        <button
          onClick={handleSubmit}
          className="bg-mc-yellow text-black font-pixel text-xs py-4 rounded border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all shadow-md"
        >
          TAST INN KODE →
        </button>
      </div>

      {/* Footer */}
      <p className="font-pixel text-purple-500 text-xs text-center">
        Piip ønsker lykke til! 🐥
      </p>
    </div>
  );
}
