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

export default function SanderHub() {
  const navigate = useNavigate();
  const game = useGame();
  const [achievement, setAchievement] = useState<{ title: string; desc?: string } | null>(null);

  const secretUnlocked = game.allEggsFound('sander', TOTAL_EGGS) || game.isSecretUnlocked('sander');

  // Finn neste aktive avdeling
  const nextDept = (() => {
    for (let i = 1; i <= 12; i++) {
      if (!game.isDeptComplete('sander', i)) return i;
    }
    if (secretUnlocked && !game.isDeptComplete('sander', 13)) return 13;
    return null; // alt fullført
  })();

  const allComplete = (() => {
    for (let i = 1; i <= 12; i++) {
      if (!game.isDeptComplete('sander', i)) return false;
    }
    if (secretUnlocked && !game.isDeptComplete('sander', 13)) return false;
    if (!secretUnlocked) return false; // kan ikke fullføre uten hemmelig
    return true;
  })();

  const getStatus = (id: number) => {
    if (game.isDeptComplete('sander', id)) return 'completed' as const;
    if (id === nextDept) return 'active' as const;
    return 'locked' as const;
  };

  const handleCardClick = useCallback((id: number) => {
    navigate(`/sander/${id}`);
  }, [navigate]);

  if (allComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-8 text-center">
        <div className="text-6xl">🏆</div>
        <h2 className="font-pixel text-mc-yellow text-sm leading-relaxed">
          ALLE SAKER LØST!
        </h2>
        <p className="font-pixel text-white text-xs leading-relaxed max-w-xs">
          Kodeknekkeren — du har bevist at du er Påskedetektivenes beste agent.
        </p>
        <div className="bg-mc-dark border-2 border-mc-yellow rounded-lg p-6">
          <p className="font-pixel text-gray-400 text-xs mb-2">DIN HEMMELIGE KODE:</p>
          <p className="font-pixel text-mc-yellow text-4xl tracking-widest">42</p>
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
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">
      <AchievementPopup
        show={!!achievement}
        title={achievement?.title || ''}
        description={achievement?.desc}
        onDone={() => setAchievement(null)}
      />

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
          DETEKTIVKONTORET
        </h1>
        <p className="font-pixel text-gray-400 text-xs mt-2">AGENT: SANDER</p>
        <p className="font-pixel text-gray-500 text-xs mt-1">
          {Array.from({length: 12}, (_, i) => i + 1).filter(i => game.isDeptComplete('sander', i)).length}/12 fullført
        </p>
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
            status={game.isDeptComplete('sander', 13) ? 'completed' : 'secret'}
            onClick={() => handleCardClick(13)}
          />
        </div>
      )}
    </div>
  );
}
