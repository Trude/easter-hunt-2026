import { useState, useEffect, useRef, useCallback } from 'react';

const PIIP_IMG = '/assets/piip/piip_icon.png';

const GRID_SIZE = 12;
const REQUIRED_HITS = 20;
const GAME_DURATION = 45;

// ─── Difficulty tiers based on elapsed seconds ──────────────
interface Tier {
  spawnInterval: number;   // ms between spawns
  showDuration: number;    // ms item stays visible
  maxActive: number;       // max items on screen at once
  crowChance: number;      // chance of crow (lose 1 point)
  foxChance: number;       // chance of fox (lose 2 points)
  goldenChance: number;    // chance of golden piip (worth 3 points)
  bombChance: number;      // chance of bomb (lose 3 points)
}

function getTier(elapsed: number): Tier {
  if (elapsed < 8) {
    // Oppvarming: rolig, bare piip og noen kråker
    return {
      spawnInterval: 650,
      showDuration: 1000,
      maxActive: 2,
      crowChance: 0.1,
      foxChance: 0,
      goldenChance: 0,
      bombChance: 0,
    };
  }
  if (elapsed < 16) {
    // Litt raskere, kråker oftere
    return {
      spawnInterval: 520,
      showDuration: 850,
      maxActive: 3,
      crowChance: 0.2,
      foxChance: 0,
      goldenChance: 0.05,
      bombChance: 0,
    };
  }
  if (elapsed < 24) {
    // Rev dukker opp! Ting forsvinner raskere
    return {
      spawnInterval: 420,
      showDuration: 700,
      maxActive: 4,
      crowChance: 0.2,
      foxChance: 0.1,
      goldenChance: 0.08,
      bombChance: 0,
    };
  }
  if (elapsed < 34) {
    // Kaos: bomben kommer, mye på skjermen
    return {
      spawnInterval: 340,
      showDuration: 600,
      maxActive: 5,
      crowChance: 0.2,
      foxChance: 0.12,
      goldenChance: 0.1,
      bombChance: 0.08,
    };
  }
  // Siste 11s: PANIKK
  return {
    spawnInterval: 260,
    showDuration: 480,
    maxActive: 6,
    crowChance: 0.22,
    foxChance: 0.15,
    goldenChance: 0.12,
    bombChance: 0.1,
  };
}

type ItemType = 'piip' | 'crow' | 'fox' | 'golden' | 'bomb';

const ITEM_CONFIG: Record<ItemType, { emoji: string; points: number; bg: string; border: string }> = {
  piip:   { emoji: '🐥', points: 1,  bg: 'bg-mc-green',        border: 'border-green-400' },
  golden: { emoji: '⭐', points: 3,  bg: 'bg-yellow-500',      border: 'border-yellow-300' },
  crow:   { emoji: '🐦', points: -1, bg: 'bg-red-900',         border: 'border-red-500' },
  fox:    { emoji: '🦊', points: -2, bg: 'bg-orange-800',      border: 'border-orange-500' },
  bomb:   { emoji: '💣', points: -3, bg: 'bg-gray-900',        border: 'border-gray-500' },
};

interface ActiveItem {
  index: number;
  type: ItemType;
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
  const [flash, setFlash] = useState<{ index: number; color: string } | null>(null);
  const [tierName, setTierName] = useState('');
  const [bestScore, setBestScore] = useState(0);
  const scoreRef = useRef(0);
  const activeRef = useRef<ActiveItem[]>([]);
  const spawnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const elapsedRef = useRef(0);

  const cleanup = useCallback(() => {
    if (spawnRef.current) clearTimeout(spawnRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    activeRef.current.forEach(i => clearTimeout(i.timerId));
    activeRef.current = [];
    setActiveItems([]);
  }, []);

  const endGame = useCallback((finalScore: number) => {
    cleanup();
    setBestScore(prev => Math.max(prev, finalScore));
    if (finalScore >= REQUIRED_HITS) {
      setPhase('won');
      phaseRef.current = 'won';
      setTimeout(onComplete, 800);
    } else {
      setPhase('lost');
      phaseRef.current = 'lost';
    }
  }, [cleanup, onComplete]);

  // Spawn loop — schedules itself with dynamic interval
  const spawnItem = useCallback(() => {
    if (phaseRef.current !== 'playing') return;

    const tier = getTier(elapsedRef.current);

    // Spawn if under max
    if (activeRef.current.length < tier.maxActive) {
      const used = activeRef.current.map(i => i.index);
      const available = Array.from({ length: GRID_SIZE }, (_, i) => i).filter(i => !used.includes(i));

      if (available.length > 0) {
        const index = available[Math.floor(Math.random() * available.length)];

        // Determine type based on tier probabilities
        const r = Math.random();
        let type: ItemType = 'piip';
        const { crowChance, foxChance, goldenChance, bombChance } = tier;
        if (r < bombChance) {
          type = 'bomb';
        } else if (r < bombChance + foxChance) {
          type = 'fox';
        } else if (r < bombChance + foxChance + crowChance) {
          type = 'crow';
        } else if (r < bombChance + foxChance + crowChance + goldenChance) {
          type = 'golden';
        }

        const timerId = setTimeout(() => {
          activeRef.current = activeRef.current.filter(i => i.index !== index);
          setActiveItems([...activeRef.current]);
        }, tier.showDuration);

        const item: ActiveItem = { index, type, timerId };
        activeRef.current = [...activeRef.current, item];
        setActiveItems([...activeRef.current]);
      }
    }

    // Schedule next spawn
    const nextTier = getTier(elapsedRef.current);
    spawnRef.current = setTimeout(spawnItem, nextTier.spawnInterval);
  }, []);

  const startGame = useCallback(() => {
    cleanup();
    scoreRef.current = 0;
    elapsedRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setPhase('playing');
    phaseRef.current = 'playing';
    setTierName('');

    let remaining = GAME_DURATION;
    timerRef.current = setInterval(() => {
      remaining--;
      elapsedRef.current = GAME_DURATION - remaining;
      setTimeLeft(remaining);

      // Update tier name for display
      const e = elapsedRef.current;
      if (e >= 34) setTierName('PANIKK!');
      else if (e >= 24) setTierName('Bomber!');
      else if (e >= 16) setTierName('Reven kommer!');
      else if (e >= 8) setTierName('Raskere!');
      else setTierName('');

      if (remaining <= 0) endGame(scoreRef.current);
    }, 1000);

    // Start spawn loop
    spawnRef.current = setTimeout(spawnItem, 500);
  }, [cleanup, endGame, spawnItem]);

  useEffect(() => () => cleanup(), [cleanup]);

  const handleHit = useCallback((index: number) => {
    if (phaseRef.current !== 'playing') return;
    const item = activeRef.current.find(i => i.index === index);
    if (!item) return;
    clearTimeout(item.timerId);
    activeRef.current = activeRef.current.filter(i => i.index !== index);
    setActiveItems([...activeRef.current]);

    const cfg = ITEM_CONFIG[item.type];
    scoreRef.current = Math.max(0, scoreRef.current + cfg.points);
    setScore(scoreRef.current);

    // Flash feedback
    const color = cfg.points > 0 ? 'bg-green-400' : 'bg-red-500';
    setFlash({ index, color });
    setTimeout(() => setFlash(null), 200);
  }, []);

  const progressPct = Math.min(100, Math.round((score / REQUIRED_HITS) * 100));

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="flex justify-between w-full max-w-xs items-end">
        <span className="font-pixel text-xs text-mc-yellow">🧺 {score}/{REQUIRED_HITS}</span>
        {tierName && (
          <span className="font-pixel text-red-400" style={{ fontSize: 9 }}>
            🔥 {tierName}
          </span>
        )}
        <span className="font-pixel text-xs text-gray-400">⏱ {timeLeft}s</span>
      </div>

      {/* Progress bar */}
      {phase === 'playing' && (
        <div className="w-full max-w-xs h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-mc-green transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: GRID_SIZE }, (_, i) => {
          const item = activeItems.find(a => a.index === i);
          const isFlash = flash?.index === i;
          const cfg = item ? ITEM_CONFIG[item.type] : null;

          return (
            <button
              key={i}
              onClick={() => handleHit(i)}
              className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center text-4xl transition-all duration-100 select-none active:scale-95 ${
                isFlash
                  ? `${flash.color} border-white scale-95`
                  : item && cfg
                  ? `${cfg.bg} ${cfg.border} scale-110`
                  : 'bg-mc-dark border-gray-700'
              }`}
            >
              {item && cfg ? (
                item.type === 'piip' || item.type === 'golden' ? (
                  <img
                    src={PIIP_IMG}
                    alt="Piip"
                    className={`w-14 h-14 object-contain select-none ${item.type === 'golden' ? 'animate-pulse drop-shadow-[0_0_6px_gold]' : ''}`}
                    draggable={false}
                  />
                ) : (
                  <span>{cfg.emoji}</span>
                )
              ) : ''}
            </button>
          );
        })}
      </div>

      {/* Restart-knapp mens man spiller */}
      {phase === 'playing' && (
        <button
          onClick={startGame}
          className="font-pixel text-gray-500 text-xs border border-gray-700 rounded px-3 py-1.5 active:bg-gray-800 select-none"
        >
          🔄 Start på nytt
        </button>
      )}

      {phase === 'idle' && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-pixel text-xs text-gray-400 text-center leading-relaxed max-w-xs">
            Trykk på Piip så fort du kan!<br />
            Unngå fiendene — de stjeler poeng!
          </p>
          <div className="font-pixel text-gray-600 text-center leading-relaxed" style={{ fontSize: 8 }}>
            <p>Piip = +1 poeng</p>
            <p>✨ Gull-Piip = +3 poeng</p>
            <p>🐦 Kråke = -1 poeng</p>
            <p>🦊 Rev = -2 poeng</p>
            <p>💣 Bombe = -3 poeng</p>
          </div>
          {bestScore > 0 && (
            <p className="font-pixel text-gray-500" style={{ fontSize: 9 }}>
              Beste score: {bestScore}
            </p>
          )}
          <button onClick={startGame} className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
            {bestScore > 0 ? 'SPILL IGJEN →' : 'START →'}
          </button>
        </div>
      )}
      {phase === 'won' && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-pixel text-mc-green text-xs text-center">🎉 Bra jobbet! {score} poeng!</p>
          {score > bestScore - 1 && bestScore > 0 && score === bestScore && (
            <p className="font-pixel text-mc-yellow text-xs">🏆 Ny rekord!</p>
          )}
          <button onClick={startGame} className="bg-mc-green text-white font-pixel text-xs py-3 px-6 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
            🔄 Prøv å slå {score} poeng!
          </button>
        </div>
      )}
      {phase === 'lost' && (
        <div className="flex flex-col items-center gap-3">
          <div className="bg-mc-dark border border-gray-600 rounded-lg p-3 text-center">
            <p className="font-pixel text-red-400 text-xs">Bare {score} poeng — du trenger {REQUIRED_HITS}!</p>
            {bestScore > 0 && (
              <p className="font-pixel text-gray-500 mt-1" style={{ fontSize: 9 }}>
                Beste score: {bestScore}
              </p>
            )}
          </div>
          <button onClick={startGame} className="bg-mc-yellow text-black font-pixel text-xs py-3 px-8 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1">
            PRØV IGJEN
          </button>
        </div>
      )}
    </div>
  );
}
