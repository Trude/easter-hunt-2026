import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { voksneTrivia } from '../data/voksne-trivia';
import TriviaSection from '../components/trivia/TriviaSection';
import Memory from '../components/games/Memory';
import CatchEggs from '../components/games/CatchEggs';
import CatchPiip from '../components/games/CatchPiip';
import Labyrinth from '../components/games/Labyrinth';
import LavaFloor from '../components/games/LavaFloor';
import Puzzle from '../components/games/Puzzle';

const DEPT_META: Record<number, { title: string; icon: string }> = {
  1:  { title: 'Memory',               icon: '🃏' },
  2:  { title: 'Fang påskeegg!',       icon: '🥚' },
  3:  { title: 'Fang Piip!',           icon: '🐥' },
  4:  { title: 'Labyrint',             icon: '🗺️' },
  5:  { title: 'Gulvet er lava',       icon: '🌋' },
  6:  { title: 'Puslespill',           icon: '🧩' },
  7:  { title: 'Påsken & Tradisjoner', icon: '🐣' },
  8:  { title: 'Film & Serier',        icon: '🎬' },
  9:  { title: 'Norsk Historie',       icon: '🏔️' },
  10: { title: 'Mat & Drikke',         icon: '🍷' },
  11: { title: 'Sport & Idrett',       icon: '⚽' },
  12: { title: 'Verden & Geografi',    icon: '🌍' },
};

const TRIVIA_DEPTS = [7, 8, 9, 10, 11, 12];

export default function VoksneDepartment() {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const id = parseInt(deptId || '1');
  const meta = DEPT_META[id];

  const [done, setDone] = useState(false);

  const handleComplete = () => {
    setDone(true);
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 py-6 relative">
      {/* Tilbake-knapp */}
      <button
        onClick={() => navigate('/voksne')}
        className="font-pixel text-xs text-gray-600 mb-6 flex items-center gap-2"
      >
        ← TILBAKE
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{meta?.icon}</div>
        <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
          {meta?.title?.toUpperCase()}
        </h1>
        <p className="font-pixel text-gray-400 text-xs mt-1">Bare for gøy 🎉</p>
      </div>

      {/* Fullført-banner */}
      {done && (
        <div className="mb-6 border-2 border-mc-green bg-mc-dark rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-pixel text-mc-green text-xs mb-3">BRA JOBBET!</p>
          <button
            onClick={() => navigate('/voksne')}
            className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
          >
            ← TILBAKE TIL KONTORET
          </button>
        </div>
      )}

      {/* Innhold */}
      {TRIVIA_DEPTS.includes(id) && voksneTrivia[id] ? (
        <TriviaSection section={voksneTrivia[id]} onComplete={handleComplete} />
      ) : id === 1 ? (
        <Memory onComplete={handleComplete} />
      ) : id === 2 ? (
        <CatchEggs onComplete={handleComplete} />
      ) : id === 3 ? (
        <CatchPiip onComplete={handleComplete} />
      ) : id === 4 ? (
        <Labyrinth onComplete={handleComplete} />
      ) : id === 5 ? (
        <LavaFloor onComplete={handleComplete} />
      ) : id === 6 ? (
        <Puzzle onComplete={handleComplete} />
      ) : (
        <div className="flex flex-col items-center gap-6 text-center py-10">
          <div className="text-5xl">{meta?.icon}</div>
          <p className="font-pixel text-gray-400 text-xs leading-relaxed">KOMMER SNART</p>
        </div>
      )}
    </div>
  );
}
