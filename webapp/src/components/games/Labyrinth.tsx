import { useState, useEffect, useCallback } from 'react';

const MAZE = [
  [0,0,1,0,0,0,1,0,0,0,0,0],
  [1,0,1,0,1,0,1,0,1,1,1,0],
  [0,0,0,0,1,0,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,0,1,1,0],
  [0,0,0,0,0,0,0,1,0,0,0,0],
  [1,1,1,0,1,1,0,1,1,1,0,1],
  [0,0,1,0,0,1,0,0,0,1,0,0],
  [0,1,1,1,0,1,1,1,0,1,1,0],
  [0,0,0,1,0,0,0,1,0,0,0,0],
  [1,1,0,1,1,1,0,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,0,0,1,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
];

// Verifiser med BFS at labyrinten er løsbar — juster om nødvendig
function isReachable(): boolean {
  const visited = Array.from({length: 12}, () => Array(12).fill(false));
  const queue: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === 11 && c === 11) return true;
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < 12 && nc >= 0 && nc < 12 && !visited[nr][nc] && MAZE[nr][nc] === 0) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}

// Labyrinten MÅ være løsbar. Sjekk ved runtime og gi tydelig error i development.
if (!isReachable()) {
  console.error('LABYRINT ER IKKE LØSBAR — fikse MAZE-arrayet!');
}

interface Props {
  onComplete: () => void;
}

export default function Labyrinth({ onComplete }: Props) {
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [won, setWon] = useState(false);

  const move = useCallback((dr: number, dc: number) => {
    if (won) return;
    setPos(([r, c]) => {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= 12 || nc < 0 || nc >= 12) return [r, c];
      if (MAZE[nr][nc] === 1) return [r, c];
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

  // Check win
  useEffect(() => {
    if (pos[0] === 11 && pos[1] === 11 && !won) {
      setWon(true);
      setTimeout(onComplete, 1000);
    }
  }, [pos, won, onComplete]);

  const CELL = 26; // px per celle

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <p className="font-pixel text-xs text-gray-400 text-center">
        Hjelp Piip finne Påskeharen! 🐥
      </p>

      {/* Labyrint */}
      <div
        className="border-2 border-mc-yellow overflow-hidden"
        style={{ width: CELL * 12, height: CELL * 12 }}
      >
        {MAZE.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const isPlayer = pos[0] === r && pos[1] === c;
              const isGoal = r === 11 && c === 11;
              return (
                <div
                  key={c}
                  style={{ width: CELL, height: CELL }}
                  className={`flex items-center justify-center text-xs ${
                    cell === 1 ? 'bg-mc-brown' : 'bg-mc-dark'
                  } ${isGoal && !isPlayer ? 'bg-mc-green bg-opacity-30' : ''}`}
                >
                  {isPlayer && <span style={{ fontSize: CELL * 0.6 }}>🐥</span>}
                  {isGoal && !isPlayer && <span style={{ fontSize: CELL * 0.6 }}>🏠</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {won && (
        <p className="font-pixel text-mc-green text-xs text-center">
          Piip fant hjem! 🎉
        </p>
      )}

      {/* Piltaster for touch */}
      <div className="grid grid-cols-3 gap-2 mt-2">
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
