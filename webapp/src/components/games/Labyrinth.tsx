import { useState, useEffect, useCallback, useRef } from 'react';

const ROWS = 16;
const COLS = 16;

const MAZE = [
  [0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
  [1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0],
  [0,1,1,1,1,1,0,1,1,1,1,0,1,0,1,0],
  [0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0],
  [0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0],
  [0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0],
  [0,1,0,1,1,0,1,0,1,1,1,0,1,1,1,1],
  [0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0],
  [1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0],
  [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
  [0,1,1,1,1,1,0,1,1,1,1,0,0,1,0,1],
  [0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0],
  [1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,0],
  [0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
  [1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0],
];

function isReachable(): boolean {
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const queue: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === ROWS - 1 && c === COLS - 1) return true;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited[nr][nc] && MAZE[nr][nc] === 0) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}

if (!isReachable()) {
  console.error('LABYRINT ER IKKE LØSBAR — fiks MAZE-arrayet!');
}

interface Props {
  onComplete: () => void;
}

export default function Labyrinth({ onComplete }: Props) {
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const move = useCallback((dr: number, dc: number) => {
    if (won) return;
    setPos(([r, c]) => {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return [r, c];
      if (MAZE[nr][nc] === 1) return [r, c];
      if (nr !== r || nc !== c) setMoves(m => m + 1);
      return [nr, nc];
    });
  }, [won]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); move(-1, 0); }
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1, 0); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(0, -1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); move(0, 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move]);

  // Swipe support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const MIN_SWIPE = 20;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > MIN_SWIPE) move(0, dx > 0 ? 1 : -1);
    } else {
      if (Math.abs(dy) > MIN_SWIPE) move(dy > 0 ? 1 : -1, 0);
    }
    touchStart.current = null;
  }, [move]);

  // Check win
  useEffect(() => {
    if (pos[0] === ROWS - 1 && pos[1] === COLS - 1 && !won) {
      setWon(true);
      setTimeout(onComplete, 1000);
    }
  }, [pos, won, onComplete]);

  const CELL = 20;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-pixel text-xs text-gray-400 text-center">
        Hjelp Piip gjennom labyrinten! 🐥
      </p>
      <p className="font-pixel text-gray-500" style={{ fontSize: 9 }}>
        Trekk: {moves}
      </p>

      {/* Labyrint */}
      <div
        className="border-2 border-mc-yellow overflow-hidden"
        style={{ width: CELL * COLS, height: CELL * ROWS }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {MAZE.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const isPlayer = pos[0] === r && pos[1] === c;
              const isGoal = r === ROWS - 1 && c === COLS - 1;
              return (
                <div
                  key={c}
                  style={{ width: CELL, height: CELL }}
                  className={`flex items-center justify-center ${
                    cell === 1 ? 'bg-mc-brown' : 'bg-mc-dark'
                  } ${isGoal && !isPlayer ? 'bg-mc-green bg-opacity-30' : ''}`}
                >
                  {isPlayer && <span style={{ fontSize: CELL * 0.65 }}>🐥</span>}
                  {isGoal && !isPlayer && <span style={{ fontSize: CELL * 0.65 }}>🏠</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {won && (
        <p className="font-pixel text-mc-green text-xs text-center">
          Piip fant hjem på {moves} trekk! 🎉
        </p>
      )}

      {/* Piltaster for touch */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        <div />
        <button onClick={() => move(-1, 0)} className="bg-mc-dark border border-gray-600 rounded p-3 text-white text-lg active:bg-gray-700">▲</button>
        <div />
        <button onClick={() => move(0, -1)} className="bg-mc-dark border border-gray-600 rounded p-3 text-white text-lg active:bg-gray-700">◀</button>
        <button onClick={() => move(1, 0)} className="bg-mc-dark border border-gray-600 rounded p-3 text-white text-lg active:bg-gray-700">▼</button>
        <button onClick={() => move(0, 1)} className="bg-mc-dark border border-gray-600 rounded p-3 text-white text-lg active:bg-gray-700">▶</button>
      </div>
    </div>
  );
}
