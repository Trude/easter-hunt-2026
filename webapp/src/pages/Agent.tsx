import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { sveinGroups } from '../data/svein-trivia';
import { storage } from '../lib/storage';

const LETTERS = ['O', 'N', 'K', 'E', 'L', 'S'];

export default function Agent() {
  const navigate = useNavigate();
  const game = useGame();

  const groupsDone = sveinGroups.map(g => game.isDeptComplete('svein', g.id));
  const allDone = groupsDone.every(Boolean);
  const nextGroup = sveinGroups.findIndex((_, i) => !groupsDone[i]);

  return (
    <div className="min-h-screen bg-mc-dark px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block border-2 border-red-700 bg-black/50 rounded px-4 py-1 mb-3">
          <p className="font-pixel text-red-500 text-xs tracking-widest">KLASSIFISERT</p>
        </div>
        <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">AGENT ØRANSEN</h1>
        <p className="font-pixel text-gray-400 text-xs mt-1">
          {groupsDone.filter(Boolean).length}/6 arkivmapper dekryptert
        </p>
      </div>

      {/* Bokstav-indikatorer */}
      <div className="flex gap-2 justify-center mb-6">
        {LETTERS.map((l, i) => (
          <div
            key={i}
            className={`w-9 h-9 border-2 flex items-center justify-center transition-colors ${
              groupsDone[i]
                ? 'border-mc-yellow bg-mc-yellow/20'
                : 'border-gray-700 bg-black/30'
            }`}
          >
            <span className={`font-pixel text-xs ${groupsDone[i] ? 'text-mc-yellow' : 'text-gray-700'}`}>
              {groupsDone[i] ? l : '?'}
            </span>
          </div>
        ))}
      </div>

      {/* Fullført-banner */}
      {allDone && (
        <div className="mb-6 border-2 border-mc-yellow bg-black/50 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🔓</div>
          <p className="font-pixel text-red-500 text-xs tracking-widest mb-3">KLASSIFISERT — DEKRYPTERT</p>

          <div className="border border-gray-600 rounded p-3 mb-3 text-left">
            <p className="font-pixel text-gray-300 text-xs leading-relaxed">
              Agent Øransen — oppdraget er fullført.
            </p>
            <p className="font-pixel text-gray-400 text-xs leading-relaxed mt-2">
              Men det virkelige mysteriet var aldri Påskeharen.
              Det var hvordan noen klarer å bli 54 og fortsatt tro at Liverpool vinner ligaen hvert år.
            </p>
            <p className="font-pixel text-mc-green text-xs leading-relaxed mt-3">
              Gratulerer med dagen, Svein. 🎂
            </p>
            <p className="font-pixel text-gray-400 text-xs leading-relaxed mt-3">
              Barna trenger deg nå. Møt dem ved peisen.
            </p>
          </div>

          <div className="bg-black/40 rounded p-3">
            <p className="font-pixel text-gray-400 text-xs mb-1">DIN KODE TIL KOMBINER:</p>
            <p className="font-pixel text-mc-yellow text-2xl tracking-widest">ONKELS</p>
          </div>
        </div>
      )}

      {/* Gruppe-kort */}
      <div className="flex flex-col gap-3">
        {sveinGroups.map((group, i) => {
          const done = groupsDone[i];
          const isNext = i === nextGroup;
          const locked = !done && !isNext && !allDone;

          return (
            <button
              key={group.id}
              disabled={locked}
              onClick={() => !locked && navigate(`/agent/gruppe/${group.id}`)}
              className={`w-full text-left rounded border-2 p-4 transition-all ${
                done
                  ? 'border-mc-green bg-mc-green/10'
                  : isNext
                  ? 'border-mc-yellow bg-mc-yellow/5 animate-pulse'
                  : 'border-gray-700 bg-black/20 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{group.icon}</span>
                  <div>
                    <p className={`font-pixel text-xs ${done ? 'text-mc-green' : isNext ? 'text-mc-yellow' : 'text-gray-600'}`}>
                      MAPPE #{group.id}
                    </p>
                    <p className={`font-pixel text-xs mt-0.5 ${done ? 'text-white' : isNext ? 'text-white' : 'text-gray-600'}`}>
                      {group.title}
                    </p>
                  </div>
                </div>
                <div className={`w-8 h-8 border flex items-center justify-center ${
                  done ? 'border-mc-yellow bg-mc-yellow/20' : 'border-gray-700'
                }`}>
                  <span className={`font-pixel text-xs ${done ? 'text-mc-yellow' : 'text-gray-700'}`}>
                    {done ? group.letter : locked ? '🔒' : '→'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Reset knapp (diskret, for testing) */}
      <div className="mt-8 text-center">
        <button
          onClick={() => { storage.resetAll(); window.location.reload(); }}
          className="font-pixel text-gray-700 text-xs"
        >
          [RESET]
        </button>
      </div>
    </div>
  );
}
