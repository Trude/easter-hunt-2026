import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { seldaTrivia } from '../data/selda-trivia';
import TriviaSection from '../components/trivia/TriviaSection';

const TRIVIA_DEPTS = [1, 3, 5, 7, 9, 11];

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

export default function SeldaDepartment() {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const game = useGame();
  const id = parseInt(deptId || '1');

  const meta = DEPT_META[id];
  const isCompleted = game.isDeptComplete('selda', id);

  const handleComplete = () => {
    game.completeDept('selda', id);
    navigate('/selda');
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 py-6">
      {/* Tilbake-knapp */}
      <button
        onClick={() => navigate('/selda')}
        className="font-pixel text-xs text-gray-400 mb-6 flex items-center gap-2"
      >
        ← TILBAKE
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{meta?.icon}</div>
        <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
          AVDELING {id}
        </h1>
        <p className="font-pixel text-white text-xs mt-1">{meta?.title}</p>
        {isCompleted && (
          <p className="font-pixel text-mc-green text-xs mt-2">✅ FULLFØRT</p>
        )}
      </div>

      {/* Innhold */}
      {TRIVIA_DEPTS.includes(id) && seldaTrivia[id] ? (
        <TriviaSection
          section={seldaTrivia[id]}
          onComplete={handleComplete}
        />
      ) : (
        <div className="flex flex-col items-center gap-6 text-center py-10">
          <div className="text-5xl">{meta?.icon}</div>
          <p className="font-pixel text-gray-400 text-xs leading-relaxed">
            KOMMER SNART
          </p>
          {/* Placeholder-knapp for testing */}
          <button
            onClick={handleComplete}
            className="bg-gray-700 text-gray-300 font-pixel text-xs py-3 px-6 rounded border border-gray-600"
          >
            [TEST: MARKER FULLFØRT]
          </button>
        </div>
      )}
    </div>
  );
}
