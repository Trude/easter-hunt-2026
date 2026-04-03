import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { sveinGroups } from '../data/svein-trivia';
import { storage } from '../lib/storage';

const LETTERS = ['R', 'G', 'O', 'T', 'U', 'L'];

type AgentStep =
  | { type: 'trivia'; stepId: number; groupId: number }
  | { type: 'game'; stepId: number; title: string; icon: string };

// Trivia groups (IDs 1–6) og spill (IDs 7–11) vekselvis
const STEPS: AgentStep[] = [
  { type: 'trivia', stepId: 1, groupId: 1 },
  { type: 'game',   stepId: 7,  title: 'Memory',         icon: '🃏' },
  { type: 'trivia', stepId: 2, groupId: 2 },
  { type: 'game',   stepId: 8,  title: 'Fang Piip!',     icon: '🐥' },
  { type: 'trivia', stepId: 3, groupId: 3 },
  { type: 'game',   stepId: 9,  title: 'Labyrint',       icon: '🗺️' },
  { type: 'trivia', stepId: 4, groupId: 4 },
  { type: 'game',   stepId: 10, title: 'Fang påskeegg!', icon: '🥚' },
  { type: 'trivia', stepId: 5, groupId: 5 },
  { type: 'game',   stepId: 11, title: 'Gulvet er lava', icon: '🌋' },
  { type: 'trivia', stepId: 12, groupId: 7 },
  { type: 'trivia', stepId: 6, groupId: 6 },
];

export default function Agent() {
  const navigate = useNavigate();
  const game = useGame();

  const stepsDone = STEPS.map(s => game.isDeptComplete('svein', s.stepId));
  const groupsDone = sveinGroups.map(g => game.isDeptComplete('svein', g.id));
  const allDone = stepsDone.every(Boolean);
  const nextStepIdx = stepsDone.findIndex(d => !d);

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block border-2 border-red-700 bg-white/90 rounded px-4 py-1 mb-3">
          <p className="font-pixel text-red-500 text-xs tracking-widest">KLASSIFISERT</p>
        </div>
        <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">AGENT ØRANSEN</h1>
        <p className="font-pixel text-gray-600 text-xs mt-1">
          {stepsDone.filter(Boolean).length}/{STEPS.length} oppdrag fullført
        </p>
      </div>

      {/* Bokstav-indikatorer */}
      <div className="flex gap-2 justify-center mb-6">
        {LETTERS.map((l, i) => (
          <div
            key={i}
            className={`w-9 h-9 border-2 rounded flex items-center justify-center transition-colors ${
              groupsDone[i]
                ? 'border-yellow-400 bg-yellow-100 shadow-sm shadow-yellow-200'
                : 'border-purple-200 bg-purple-50'
            }`}
          >
            <span className={`font-pixel text-xs ${groupsDone[i] ? 'text-yellow-600' : 'text-purple-400'}`}>
              {groupsDone[i] ? l : '?'}
            </span>
          </div>
        ))}
      </div>

      {/* Fullført-banner */}
      {allDone && (
        <div className="mb-6 border-2 border-mc-yellow bg-white/90 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🔓</div>
          <p className="font-pixel text-red-500 text-xs tracking-widest mb-3">KLASSIFISERT — DEKRYPTERT</p>

          <div className="border border-gray-300 rounded p-3 mb-3 text-left">
            <p className="font-pixel text-gray-700 text-xs leading-relaxed">
              Agent Øransen — oppdraget er fullført.
            </p>
            <p className="font-pixel text-gray-600 text-xs leading-relaxed mt-2">
              Men det virkelige mysteriet var aldri Påskeharen.
              Det var hvordan noen klarer å bli 54 og fortsatt tro at Liverpool vinner ligaen hvert år.
            </p>
            <p className="font-pixel text-mc-green text-xs leading-relaxed mt-3">
              Gratulerer med dagen, Svein. 🎂
            </p>
            <p className="font-pixel text-gray-600 text-xs leading-relaxed mt-3">
              Barna trenger deg nå. Tid for å kombinere kodene!
            </p>
          </div>

          <div className="bg-yellow-100 border border-yellow-400 rounded p-3 mb-3">
            <p className="font-pixel text-gray-600 text-xs leading-relaxed">
              Sett sammen bokstavene du har samlet — de avslører kodeordet ditt til KOMBINER!
            </p>
          </div>

          <button
            onClick={() => navigate('/kombiner')}
            className="bg-mc-green text-white font-pixel text-xs py-3 px-6 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
          >
            GÅ TIL KOMBINER →
          </button>
        </div>
      )}

      {/* Steg-kort */}
      <div className="flex flex-col gap-3">
        {STEPS.map((step, i) => {
          const done = stepsDone[i];
          const isNext = i === nextStepIdx;
          const locked = !done && !isNext && !allDone;

          const group = step.type === 'trivia'
            ? sveinGroups.find(g => g.id === step.groupId)
            : null;

          const icon = step.type === 'trivia' ? (group?.icon ?? '📁') : step.icon;
          const title = step.type === 'trivia' ? (group?.title ?? '') : step.title;
          const label = step.type === 'trivia' ? `MAPPE #${step.groupId}` : 'FELTOPPDRAG';

          const handleClick = () => {
            if (locked) return;
            if (step.type === 'trivia') {
              navigate(`/agent/gruppe/${step.groupId}`);
            } else {
              navigate(`/agent/spill/${step.stepId}`);
            }
          };

          return (
            <button
              key={step.stepId}
              disabled={locked}
              onClick={handleClick}
              className={`w-full text-left rounded border-2 p-4 transition-all ${
                done
                  ? 'border-mc-green bg-mc-green/10'
                  : isNext
                  ? 'border-mc-yellow bg-mc-yellow/5 animate-pulse'
                  : 'border-gray-200 bg-white/70 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className={`font-pixel text-xs ${done ? 'text-mc-green' : isNext ? 'text-mc-yellow' : 'text-gray-600'}`}>
                      {label}
                    </p>
                    <p className={`font-pixel text-xs mt-0.5 ${done ? 'text-gray-700' : isNext ? 'text-gray-700' : 'text-gray-600'}`}>
                      {title}
                    </p>
                  </div>
                </div>
                <div className={`w-8 h-8 border flex items-center justify-center ${
                  done ? 'border-mc-yellow bg-mc-yellow/20' : 'border-gray-200'
                }`}>
                  {step.type === 'trivia' && group ? (
                    <span className={`font-pixel text-xs ${done ? 'text-mc-yellow' : 'text-gray-700'}`}>
                      {done ? group.letter : locked ? '🔒' : '→'}
                    </span>
                  ) : (
                    <span className="text-sm">
                      {done ? '✅' : locked ? '🔒' : '→'}
                    </span>
                  )}
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
