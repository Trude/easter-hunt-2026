import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 12;
const REQUIRED_HITS = 12;
const GAME_DURATION = 45;
const SHOW_DURATION = 850;
const SPAWN_INTERVAL = 600;

interface ActiveItem {
  index: number;
  type: 'piip' | 'crow';
  timerId: ReturnType<typeof setTimeout>;
}

interface Props {
  onComplete: () => void;
}

export default function CatchPiip({ onComplete }: Props) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeItems, setActiveItems] = useState<ActiveItem[]>([]);
  const scoreRef = useRef(0);
  const activeRef = useRef<ActiveItem[]>([]);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<'idle' | 'playing' | 'won' | 'lost'>('idle');

  const cleanup = useCallback(() => {
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    activeRef.current.forEach(i => clearTimeout(i.timerId));
    activeRef.current = [];
    setActiveItems([]);
  }, []);

  const endGame = useCallback((finalScore: number) => {
    cleanup();
    if (finalScore >= REQUIRED_HITS) {
      setPhase('won');
      phaseRef.current = 'won';
      setTimeout(onComplete, 800);
    } else {
      setPhase('lost');
      phaseRef.current = 'lost';
    }
  }, [cleanup, onComplete]);

  const startGame = useCallback(() => {
    cleanup();
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setPhase('playing');
    phaseRef.current = 'playing';

    let remaining = GAME_DURATION;
    timerRef.current = setInterval(() => {
      remaining--;
      setTimeLeft(remaining);
      if (remaining <= 0) endGame(scoreRef.current);
    }, 1000);

    spawnRef.current = setInterval(() => {
      if (phaseRef.current !== 'playing') return;
      const used = activeRef.current.map(i => i.index);
      const available = Array.from({ length: GRID_SIZE }, (_, i) => i).filter(i => !used.includes(i));
      if (available.length === 0) return;
      const index = available[Math.floor(Math.random() * available.length)];
      const type: 'piip' | 'crow' = Math.random() < 0.2 ? 'crow' : 'piip';
      const timerId = setTimeout(() => {
        activeRef.current = activeRef.current.filter(i => i.index !== index);
        setActiveItems([...activeRef.current]);
      }, SHOW_DURATION);
      const item: ActiveItem = { index, type, timerId };
      activeRef.current = [...activeRef.current, item];
      setActiveItems([...activeRef.current]);
    }, SPAWN_INTERVAL);
  }, [cleanup, endGame]);

  useEffect(() => () => cleanup(), [cleanup]);

  const handleHit = useCallback((index: number) => {
    if (phaseRef.current !== 'playing') return;
    const item = activeRef.current.find(i => i.index === index);
    if (!item) return;
    clearTimeout(item.timerId);
    activeRef.current = activeRef.current.filter(i => i.index !== index);
    setActiveItems([...activeRef.current]);
    scoreRef.current = item.type === 'piip'
      ? scoreRef.current + 1
      : Math.max(0, scoreRef.current - 1);
    setScore(scoreRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full max-w-xs">
        <span className="font-pixel text-xs text-mc-yellow">🐥 {score}/{REQUIRED_HITS}</span>
        <span className="font-pixel text-xs text-gray-600">⏱ {timeLeft}s</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: GRID_SIZE }, (_, i) => {
          const item = activeItems.find(a => a.index === i);
          return (
            <button
              key={i}
              onClick={() => handleHit(i)}
              className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center text-4xl transition-all duration-100 select-none active:scale-95 ${
                item
                  ? item.type === 'piip'
                    ? 'bg-mc-green border-green-400 scale-110'
                    : 'bg-red-900 border-red-500 scale-105'
                  : 'bg-yellow-50 border-gray-200'
              }`}
            >
              {item ? (item.type === 'piip' ? '🐥' : '🐦') : ''}
            </button>
          );
        })}
      </div>

      {phase === 'idle' && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-pixel text-xs text-gray-600 text-center leading-relaxed max-w-xs">
            Trykk på Piip 🐥 så fort du kan! Unngå kråkene 🐦
          </p>
          <button onClick={startGame} className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
            START →
          </button>
        </div>
      )}
      {phase === 'won' && <p className="font-pixel text-mc-green text-xs text-center">🎉 Bra jobbet! {score} treff!</p>}
      {phase === 'lost' && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-pixel text-red-400 text-xs text-center">Bare {score} treff — du trenger {REQUIRED_HITS}!</p>
          <button onClick={startGame} className="bg-mc-yellow text-black font-pixel text-xs py-3 px-8 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1">
            PRØV IGJEN
          </button>
        </div>
      )}
    </div>
  );
}
