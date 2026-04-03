import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import Memory from '../components/games/Memory';
import CatchPiip from '../components/games/CatchPiip';
import Labyrinth from '../components/games/Labyrinth';
import CatchEggs from '../components/games/CatchEggs';
import LavaFloor from '../components/games/LavaFloor';

const GAME_META: Record<number, { title: string; icon: string }> = {
  7:  { title: 'Memory', icon: '🃏' },
  8:  { title: 'Fang Piip!', icon: '🐥' },
  9:  { title: 'Labyrint', icon: '🗺️' },
  10: { title: 'Fang påskeegg!', icon: '🥚' },
  11: { title: 'Gulvet er lava', icon: '🌋' },
};

export default function AgentGame() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const game = useGame();
  const id = parseInt(stepId || '7');
  const [done, setDone] = useState(false);

  const meta = GAME_META[id];

  const handleComplete = () => {
    if (!game.isDeptComplete('svein', id)) {
      game.completeDept('svein', id);
    }
    setDone(true);
  };

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-red-400 text-xs">Ukjent oppdrag</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-6 max-w-lg mx-auto">
      {/* Tilbake */}
      <button
        onClick={() => navigate('/agent')}
        className="font-pixel text-xs text-gray-600 mb-6 flex items-center gap-2"
      >
        ← TILBAKE
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block border border-red-700 bg-white/80 rounded px-3 py-0.5 mb-2">
          <p className="font-pixel text-red-500 text-xs">FELTOPPDRAG</p>
        </div>
        <div className="text-3xl mb-1">{meta.icon}</div>
        <p className="font-pixel text-mc-yellow text-xs">{meta.title.toUpperCase()}</p>
        <p className="font-pixel text-gray-500 text-xs mt-1">
          Fullfør spillet for å låse opp neste arkivmappe.
        </p>
      </div>

      {/* Fullført */}
      {done && (
        <div className="mb-6 border-2 border-mc-green bg-white/90 rounded-lg p-4 text-center">
          <p className="font-pixel text-mc-green text-xs mb-3">✅ FELTOPPDRAG FULLFØRT!</p>
          <button
            onClick={() => navigate('/agent')}
            className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
          >
            ← TILBAKE TIL OPPDRAGET
          </button>
        </div>
      )}

      {/* Spill */}
      {id === 7 && <Memory onComplete={handleComplete} />}
      {id === 8 && <CatchPiip onComplete={handleComplete} />}
      {id === 9 && <Labyrinth onComplete={handleComplete} />}
      {id === 10 && <CatchEggs onComplete={handleComplete} />}
      {id === 11 && <LavaFloor onComplete={handleComplete} />}

    </div>
  );
}
