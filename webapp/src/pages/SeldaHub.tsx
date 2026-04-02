import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import DepartmentCard from '../components/ui/DepartmentCard';
import AchievementPopup from '../components/ui/AchievementPopup';
import eggImg from '../assets/easteregg.png';
import eggCrackedImg from '../assets/easteregg_cracked.png';

// Bokstaver per avdeling (scrambled PÅSKEBEVISENE)
const DEPT_LETTERS: Record<number, string> = {
  1: 'E', 2: 'V', 3: 'S', 4: 'Å', 5: 'N',
  6: 'B', 7: 'I', 8: 'P', 9: 'E', 10: 'K',
  11: 'S', 12: 'E', 13: 'E',
};

const DEPT_META = [
  { id: 1, title: 'Påske & Krim', icon: '🔍' },
  { id: 2, title: 'Memory', icon: '🃏' },
  { id: 3, title: 'Minecraft & Gaming', icon: '🎮' },
  { id: 4, title: 'Fang påskeegg!', icon: '🥚' },
  { id: 5, title: 'Norsk & Verden', icon: '🌍' },
  { id: 6, title: 'Fang Piip!', icon: '🐥' },
  { id: 7, title: 'Musikk', icon: '🎵' },
  { id: 8, title: 'Labyrint', icon: '🗺️' },
  { id: 9, title: 'Natur & Dyr', icon: '🐾' },
  { id: 10, title: 'Bunny Jump', icon: '🐇' },
  { id: 11, title: 'Slang & Popkultur', icon: '😎' },
  { id: 12, title: 'Puslespill', icon: '🧩' },
];

const TOTAL_EGGS = 6;

const HUB_EGG = { id: '1', style: 'absolute top-1 right-1' };

export default function SeldaHub() {
  const navigate = useNavigate();
  const game = useGame();
  const [achievement, setAchievement] = useState<{ title: string; desc?: string } | null>(null);
  const [showEggInfo, setShowEggInfo] = useState(false);

  const secretUnlocked = game.allEggsFound('selda', TOTAL_EGGS) || game.isSecretUnlocked('selda');

  const nextDept = (() => {
    for (let i = 1; i <= 12; i++) {
      if (!game.isDeptComplete('selda', i)) return i;
    }
    if (secretUnlocked && !game.isDeptComplete('selda', 13)) return 13;
    return null;
  })();

  const allComplete = (() => {
    for (let i = 1; i <= 12; i++) {
      if (!game.isDeptComplete('selda', i)) return false;
    }
    if (secretUnlocked && !game.isDeptComplete('selda', 13)) return false;
    if (!secretUnlocked) return false;
    return true;
  })();

  const getStatus = (id: number) => {
    if (game.isDeptComplete('selda', id)) return 'completed' as const;
    if (allComplete) return 'completed' as const;
    if (id === nextDept) return 'active' as const;
    return 'locked' as const;
  };

  const handleCardClick = useCallback((id: number) => {
    navigate(`/selda/${id}`);
  }, [navigate]);

  const handleEggFound = useCallback((eggId: string) => {
    if (game.isEggFound('selda', eggId)) return;
    game.foundEgg('selda', eggId);
    const count = game.countEggsFound('selda', TOTAL_EGGS);
    if (count >= TOTAL_EGGS) {
      setAchievement({ title: 'ALLE EGG FUNNET! 🥚', desc: 'Hemmelig avdeling låst opp!' });
    } else {
      setAchievement({ title: `Påskeegg funnet! (${count}/${TOTAL_EGGS})` });
    }
  }, [game]);

  const eggsFound = game.countEggsFound('selda', TOTAL_EGGS);

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto relative">
      <AchievementPopup
        show={!!achievement}
        title={achievement?.title || ''}
        description={achievement?.desc}
        onDone={() => setAchievement(null)}
      />

      {/* Skjult påskeegg #1 — de andre er gjemt i avdelingene */}
      {(() => {
        const found = game.isEggFound('selda', HUB_EGG.id);
        return (
          <button
            onClick={() => handleEggFound(HUB_EGG.id)}
            className={`${HUB_EGG.style} absolute p-0 select-none touch-manipulation transition-opacity ${
              found ? 'opacity-90' : 'opacity-50 hover:opacity-75'
            }`}
          >
            <img src={found ? eggCrackedImg : eggImg} alt="påskeegg" className="w-12 h-12 object-contain" />
          </button>
        );
      })()}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-2xl mb-3 select-none">🐾🐣🌷</div>
        <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-xl px-5 py-2 mb-2 shadow-sm shadow-yellow-200">
          <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
            DETEKTIVKONTORET
          </h1>
        </div>
        <div className="inline-block bg-purple-100 border border-purple-300 rounded px-3 py-1 mt-1">
          <p className="font-pixel text-purple-600 text-xs">AGENT: SPORHUNDEN</p>
        </div>
        <p className="font-pixel text-gray-500 text-xs mt-1">
          {Array.from({length: 12}, (_, i) => i + 1).filter(i => game.isDeptComplete('selda', i)).length}/12 fullført
        </p>
        <button
          onClick={() => setShowEggInfo(v => !v)}
          className="font-pixel text-yellow-600 text-xs mt-2 underline decoration-dotted"
        >
          <img src={eggsFound > 0 ? eggCrackedImg : eggImg} alt="egg" className="inline w-5 h-5 object-contain align-middle mr-1" />
          {eggsFound}/{TOTAL_EGGS} påskeegg funnet
        </button>
        {showEggInfo && (
          <div className="mt-2 border border-yellow-300 bg-yellow-50 rounded-lg px-3 py-2 max-w-xs mx-auto text-left">
            <p className="font-pixel text-gray-700 text-xs leading-relaxed">
              Det er gjemt {TOTAL_EGGS} påskeegg rundt omkring i applikasjonen. Klarer du å finne dem alle?
            </p>
          </div>
        )}
      </div>

      {/* Bokstav-indikatorer */}
      <div className="mb-4">
        <p className="font-pixel text-gray-500 text-xs text-center mb-2">DITT KODEORD:</p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {Array.from({length: 13}, (_, i) => i + 1).map(id => {
            const done = game.isDeptComplete('selda', id);
            return (
              <div
                key={id}
                className={`w-8 h-8 border-2 rounded flex items-center justify-center transition-colors ${
                  done
                    ? 'border-yellow-400 bg-yellow-100 shadow-sm shadow-yellow-200'
                    : 'border-purple-200 bg-purple-50'
                }`}
              >
                <span className={`font-pixel text-xs ${done ? 'text-yellow-600' : 'text-purple-300'}`}>
                  {done ? DEPT_LETTERS[id] : '?'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullført-banner */}
      {allComplete && (
        <div className="mb-6 border-2 border-mc-yellow bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <p className="font-pixel text-mc-yellow text-xs mb-1">ALLE SAKER LØST!</p>
          <p className="font-pixel text-gray-700 text-xs mb-3">
            Sporhunden — sett sammen bokstavene og finn kodeordet ditt!
          </p>
          <button
            onClick={() => navigate('/kombiner')}
            className="bg-mc-green text-white font-pixel text-xs py-3 px-6 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
          >
            GÅ TIL KOMBINER →
          </button>
        </div>
      )}

      {/* Avdelingskort */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {DEPT_META.map(dept => (
          <DepartmentCard
            key={dept.id}
            id={dept.id}
            title={dept.title}
            icon={dept.icon}
            status={getStatus(dept.id)}
            onClick={() => handleCardClick(dept.id)}
          />
        ))}
      </div>

      {/* Hemmelig avdeling */}
      {secretUnlocked && (
        <div className="mt-2">
          <DepartmentCard
            id={13}
            title="HEMMELIG MAPPE"
            icon="🔍"
            status={game.isDeptComplete('selda', 13) ? 'completed' : 'secret'}
            onClick={() => handleCardClick(13)}
          />
        </div>
      )}
    </div>
  );
}
