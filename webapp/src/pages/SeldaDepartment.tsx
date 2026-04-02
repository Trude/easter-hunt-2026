import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { seldaTrivia } from '../data/selda-trivia';
import TriviaSection from '../components/trivia/TriviaSection';
import Memory from '../components/games/Memory';
import Labyrinth from '../components/games/Labyrinth';
import CatchEggs from '../components/games/CatchEggs';
import CatchPiip from '../components/games/CatchPiip';
import BunnyJump from '../components/games/BunnyJump';
import Puzzle from '../components/games/Puzzle';
import AchievementPopup from '../components/ui/AchievementPopup';
import { useState } from 'react';

const TRIVIA_DEPTS = [1, 3, 5, 7, 9, 11, 13];

const DEPT_META: Record<number, { title: string; icon: string }> = {
  1: { title: 'Påske & Krim', icon: '🔍' },
  2: { title: 'Memory', icon: '🃏' },
  3: { title: 'Minecraft & Gaming', icon: '🎮' },
  4: { title: 'Fang påskeegg!', icon: '🥚' },
  5: { title: 'Norsk & Verden', icon: '🌍' },
  6: { title: 'Fang Piip!', icon: '🐥' },
  7: { title: 'Musikk', icon: '🎵' },
  8: { title: 'Labyrint', icon: '🗺️' },
  9: { title: 'Natur & Dyr', icon: '🐾' },
  10: { title: 'Bunny Jump', icon: '🐇' },
  11: { title: 'Slang & Popkultur', icon: '😎' },
  12: { title: 'Puslespill', icon: '🧩' },
  13: { title: 'Hemmelig Mappe', icon: '🔍' },
};

const DEPT_EGG: Record<number, { eggId: string; position: string }> = {
  2:  { eggId: '2', position: 'bottom-3 right-3' },
  5:  { eggId: '3', position: 'top-2 left-2' },
  7:  { eggId: '4', position: 'bottom-3 left-3' },
  9:  { eggId: '5', position: 'top-2 right-2' },
  11: { eggId: '6', position: 'bottom-16 right-2' },
};

export default function SeldaDepartment() {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const game = useGame();
  const id = parseInt(deptId || '1');
  const [achievement, setAchievement] = useState<string | null>(null);

  const meta = DEPT_META[id];
  const isCompleted = game.isDeptComplete('selda', id);

  const handleComplete = () => {
    game.completeDept('selda', id);
    navigate('/selda');
  };

  const eggConfig = DEPT_EGG[id];
  const eggFound = eggConfig ? game.isEggFound('selda', eggConfig.eggId) : false;

  const handleEggFound = () => {
    if (!eggConfig || eggFound) return;
    game.foundEgg('selda', eggConfig.eggId);
    const count = game.countEggsFound('selda', 6);
    if (count >= 6) {
      setAchievement('ALLE EGG FUNNET! 🥚 Hemmelig avdeling låst opp!');
    } else {
      setAchievement(`Påskeegg funnet! (${count}/6)`);
    }
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 py-6 relative">
      <AchievementPopup
        show={!!achievement}
        title={achievement || ''}
        onDone={() => setAchievement(null)}
      />

      {/* Skjult påskeegg (kun i utvalgte avdelinger) */}
      {eggConfig && (
        <button
          onClick={handleEggFound}
          className={`absolute ${eggConfig.position} text-sm leading-none p-1 select-none touch-manipulation transition-opacity z-10 ${
            eggFound ? 'opacity-70' : 'opacity-[0.07] hover:opacity-20'
          }`}
        >
          🥚
        </button>
      )}

      {/* Tilbake-knapp */}
      <button
        onClick={() => navigate('/selda')}
        className="font-pixel text-xs text-gray-600 mb-6 flex items-center gap-2"
      >
        ← TILBAKE
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{meta?.icon}</div>
        <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
          AVDELING {id}
        </h1>
        <p className="font-pixel text-gray-700 text-xs mt-1">{meta?.title}</p>
        {isCompleted && (
          <p className="font-pixel text-mc-green text-xs mt-2">✅ FULLFØRT</p>
        )}
      </div>

      {/* Innhold */}
      {TRIVIA_DEPTS.includes(id) && seldaTrivia[id] ? (
        <TriviaSection section={seldaTrivia[id]} onComplete={handleComplete} />
      ) : id === 2 ? (
        <Memory onComplete={handleComplete} />
      ) : id === 4 ? (
        <CatchEggs onComplete={handleComplete} />
      ) : id === 6 ? (
        <CatchPiip onComplete={handleComplete} />
      ) : id === 8 ? (
        <Labyrinth onComplete={handleComplete} />
      ) : id === 10 ? (
        <BunnyJump onComplete={handleComplete} />
      ) : id === 12 ? (
        <Puzzle onComplete={handleComplete} />
      ) : (
        <div className="flex flex-col items-center gap-6 text-center py-10">
          <div className="text-5xl">{meta?.icon}</div>
          <p className="font-pixel text-gray-600 text-xs leading-relaxed">KOMMER SNART</p>
          <button
            onClick={handleComplete}
            className="bg-gray-200 text-gray-700 font-pixel text-xs py-3 px-6 rounded border border-gray-300"
          >
            [TEST: MARKER FULLFØRT]
          </button>
        </div>
      )}
    </div>
  );
}
