import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import DepartmentCard from '../components/ui/DepartmentCard';
import AchievementPopup from '../components/ui/AchievementPopup';

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

  if (allComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-8 text-center">
        <div className="text-6xl">🏆</div>
        <h2 className="font-pixel text-mc-yellow text-sm leading-relaxed">
          ALLE SAKER LØST!
        </h2>
        <p className="font-pixel text-white text-xs leading-relaxed max-w-xs">
          Sporhunden — du har bevist at du er Påskedetektivenes beste agent.
        </p>
        <div className="bg-mc-dark border-2 border-mc-yellow rounded-lg p-6">
          <p className="font-pixel text-gray-400 text-xs mb-2">DIN HEMMELIGE KODE:</p>
          <p className="font-pixel text-mc-yellow text-4xl tracking-widest">08</p>
        </div>
        <p className="font-pixel text-gray-400 text-xs leading-relaxed max-w-xs">
          Ta vare på koden. Du trenger den snart.
        </p>
        <button
          onClick={() => navigate('/kombiner')}
          className="bg-mc-green text-white font-pixel text-xs py-4 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
        >
          GÅ TIL KOMBINER →
        </button>
      </div>
    );
  }

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
            className={`${HUB_EGG.style} absolute text-sm leading-none p-1 select-none touch-manipulation transition-opacity ${
              found ? 'opacity-80' : 'opacity-[0.07] hover:opacity-20'
            }`}
          >
            🥚
          </button>
        );
      })()}

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
          DETEKTIVKONTORET
        </h1>
        <p className="font-pixel text-gray-400 text-xs mt-2">AGENT: SPORHUNDEN</p>
        <p className="font-pixel text-gray-500 text-xs mt-1">
          {Array.from({length: 12}, (_, i) => i + 1).filter(i => game.isDeptComplete('selda', i)).length}/12 fullført
        </p>
        {eggsFound > 0 && (
          <p className="font-pixel text-yellow-600 text-xs mt-1">
            🥚 {eggsFound}/{TOTAL_EGGS} påskeegg funnet
          </p>
        )}
      </div>

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
