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
  { id: 7, title: 'Sport', icon: '⚽' },
  { id: 8, title: 'Labyrint', icon: '🗺️' },
  { id: 9, title: 'Natur & Dyr', icon: '🐾' },
  { id: 10, title: 'Bunny Jump', icon: '🐇' },
  { id: 11, title: 'Slang & Popkultur', icon: '😎' },
  { id: 12, title: 'Puslespill', icon: '🧩' },
];

const TOTAL_EGGS = 6;

// Kun ett egg på huben — de andre 5 er gjemt i forskjellige avdelinger
const HUB_EGG = { id: '1', style: 'absolute top-1 right-1' };

export default function SanderHub() {
  const navigate = useNavigate();
  const game = useGame();
  const [achievement, setAchievement] = useState<{ title: string; desc?: string } | null>(null);

  const secretUnlocked = game.allEggsFound('sander', TOTAL_EGGS) || game.isSecretUnlocked('sander');

  const nextDept = (() => {
    for (let i = 1; i <= 12; i++) {
      if (!game.isDeptComplete('sander', i)) return i;
    }
    if (secretUnlocked && !game.isDeptComplete('sander', 13)) return 13;
    return null;
  })();

  const allComplete = (() => {
    for (let i = 1; i <= 12; i++) {
      if (!game.isDeptComplete('sander', i)) return false;
    }
    if (secretUnlocked && !game.isDeptComplete('sander', 13)) return false;
    if (!secretUnlocked) return false;
    return true;
  })();

  const getStatus = (id: number) => {
    if (game.isDeptComplete('sander', id)) return 'completed' as const;
    if (allComplete) return 'completed' as const;
    if (id === nextDept) return 'active' as const;
    return 'locked' as const;
  };

  const handleCardClick = useCallback((id: number) => {
    navigate(`/sander/${id}`);
  }, [navigate]);

  const handleEggFound = useCallback((eggId: string) => {
    if (game.isEggFound('sander', eggId)) return;
    game.foundEgg('sander', eggId);
    const count = game.countEggsFound('sander', TOTAL_EGGS);
    if (count >= TOTAL_EGGS) {
      setAchievement({ title: 'ALLE EGG FUNNET! 🥚', desc: 'Hemmelig avdeling låst opp!' });
    } else {
      setAchievement({ title: `Påskeegg funnet! (${count}/${TOTAL_EGGS})` });
    }
  }, [game]);

  const eggsFound = game.countEggsFound('sander', TOTAL_EGGS);

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
        const found = game.isEggFound('sander', HUB_EGG.id);
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
        <div className="text-2xl mb-3 select-none">🔍🥚🌸</div>
        <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-xl px-5 py-2 mb-2 shadow-sm shadow-yellow-200">
          <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
            DETEKTIVKONTORET
          </h1>
        </div>
        <div className="inline-block bg-purple-100 border border-purple-300 rounded px-3 py-1 mt-1">
          <p className="font-pixel text-purple-600 text-xs">AGENT: KODEKNEKKEREN</p>
        </div>
        <p className="font-pixel text-gray-500 text-xs mt-1">
          {Array.from({length: 12}, (_, i) => i + 1).filter(i => game.isDeptComplete('sander', i)).length}/12 fullført
        </p>
        {eggsFound > 0 && (
          <p className="font-pixel text-yellow-600 text-xs mt-1">
            🥚 {eggsFound}/{TOTAL_EGGS} påskeegg funnet
          </p>
        )}
      </div>

      {/* Fullført-banner med hemmelig kode */}
      {allComplete && (
        <div className="mb-6 border-2 border-mc-yellow bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <p className="font-pixel text-mc-yellow text-xs mb-1">ALLE SAKER LØST!</p>
          <p className="font-pixel text-gray-700 text-xs mb-3">
            Kodeknekkeren — du har bevist at du er Påskedetektivenes beste agent.
          </p>
          <div className="bg-yellow-100 border border-mc-yellow/40 rounded p-3 mb-3">
            <p className="font-pixel text-gray-600 text-xs mb-1">DIN HEMMELIGE KODE:</p>
            <p className="font-pixel text-mc-yellow text-3xl tracking-widest">42</p>
          </div>
          <p className="font-pixel text-gray-600 text-xs mb-3">
            Ta vare på koden. Du trenger den snart.
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
            status={game.isDeptComplete('sander', 13) ? 'completed' : 'secret'}
            onClick={() => handleCardClick(13)}
          />
        </div>
      )}
    </div>
  );
}
