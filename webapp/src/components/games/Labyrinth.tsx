import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ─── Maze dimensions ────────────────────────────────────────
// 16×16 "rooms" → 33×33 render grid (walls between rooms)
// 4× area of the old 16×16 flat grid
const ROOMS = 16;
const GRID = ROOMS * 2 + 1; // 33
const FOG_RADIUS = 3; // cells visible around player
const CELL = 10;

// ─── Seeded PRNG (mulberry32) for deterministic mazes ───────
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Shuffle array in place with given rng ──────────────────
function shuffle<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Generate perfect maze using recursive backtracking ─────
// Returns a GRID×GRID array: 0 = path, 1 = wall
// Every odd row/col intersection is a "room".
// Walls between rooms are carved when rooms connect.
// Perfect maze = exactly one path between any two rooms.
function generateMaze(seed: number): number[][] {
  const rng = mulberry32(seed);
  const grid: number[][] = Array.from({ length: GRID }, () => Array(GRID).fill(1));

  // Convert room coords (0..ROOMS-1) to grid coords
  const toGrid = (r: number) => r * 2 + 1;

  // Track visited rooms
  const visited: boolean[][] = Array.from({ length: ROOMS }, () =>
    Array(ROOMS).fill(false)
  );

  // Direction offsets in room space
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  // Iterative DFS with stack (avoids call stack limits)
  const stack: [number, number][] = [];
  const startR = 0, startC = 0;
  visited[startR][startC] = true;
  grid[toGrid(startR)][toGrid(startC)] = 0;
  stack.push([startR, startC]);

  while (stack.length > 0) {
    const [cr, cc] = stack[stack.length - 1];
    // Find unvisited neighbors
    const neighbors: [number, number, number, number][] = [];
    for (const [dr, dc] of dirs) {
      const nr = cr + dr, nc = cc + dc;
      if (nr >= 0 && nr < ROOMS && nc >= 0 && nc < ROOMS && !visited[nr][nc]) {
        neighbors.push([nr, nc, dr, dc]);
      }
    }

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    // Pick random unvisited neighbor
    shuffle(neighbors, rng);
    const [nr, nc, dr, dc] = neighbors[0];
    visited[nr][nc] = true;

    // Carve the room
    grid[toGrid(nr)][toGrid(nc)] = 0;
    // Carve the wall between current and neighbor
    grid[toGrid(cr) + dr][toGrid(cc) + dc] = 0;

    stack.push([nr, nc]);
  }

  // Ensure start (top-left room) and goal (bottom-right room) are open
  grid[1][1] = 0;
  grid[GRID - 2][GRID - 2] = 0;

  return grid;
}

// ─── BFS validation: confirm exactly one solution exists ────
function findPath(maze: number[][]): [number, number][] | null {
  const start: [number, number] = [1, 1];
  const goal: [number, number] = [GRID - 2, GRID - 2];
  const visited = Array.from({ length: GRID }, () => Array(GRID).fill(false));
  const parent = new Map<string, [number, number] | null>();
  const queue: [number, number][] = [start];
  visited[start[0]][start[1]] = true;
  parent.set(`${start[0]},${start[1]}`, null);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === goal[0] && c === goal[1]) {
      // Reconstruct path
      const path: [number, number][] = [];
      let cur: [number, number] | null = goal;
      while (cur) {
        path.unshift(cur);
        cur = parent.get(`${cur[0]},${cur[1]}`) ?? null;
      }
      return path;
    }
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < GRID && nc >= 0 && nc < GRID && !visited[nr][nc] && maze[nr][nc] === 0) {
        visited[nr][nc] = true;
        parent.set(`${nr},${nc}`, [r, c]);
        queue.push([nr, nc]);
      }
    }
  }
  return null;
}

// ─── Component ──────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

const MAZE_SEED = 20260404; // Påske 2026

export default function Labyrinth({ onComplete }: Props) {
  const maze = useMemo(() => generateMaze(MAZE_SEED), []);
  const solution = useMemo(() => findPath(maze), [maze]);

  const [pos, setPos] = useState<[number, number]>([1, 1]);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [visited, setVisited] = useState<Set<string>>(() => new Set(['1,1']));
  const [showHint, setShowHint] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Verify maze is solvable
  useEffect(() => {
    if (!solution) {
      console.error('LABYRINT ER IKKE LØSBAR — seed feilet!');
    } else {
      console.log(`Labyrint generert: løsning er ${solution.length} steg lang`);
    }
  }, [solution]);

  const move = useCallback(
    (dr: number, dc: number) => {
      if (won) return;
      setPos(([r, c]) => {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID) return [r, c];
        if (maze[nr][nc] === 1) return [r, c];
        if (nr !== r || nc !== c) {
          setMoves((m) => m + 1);
          setVisited((prev) => {
            const next = new Set(prev);
            next.add(`${nr},${nc}`);
            return next;
          });
        }
        return [nr, nc];
      });
    },
    [won, maze]
  );

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

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      const MIN_SWIPE = 15;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > MIN_SWIPE) move(0, dx > 0 ? 1 : -1);
      } else {
        if (Math.abs(dy) > MIN_SWIPE) move(dy > 0 ? 1 : -1, 0);
      }
      touchStart.current = null;
    },
    [move]
  );

  // Check win
  useEffect(() => {
    if (pos[0] === GRID - 2 && pos[1] === GRID - 2 && !won) {
      setWon(true);
      setTimeout(onComplete, 1200);
    }
  }, [pos, won, onComplete]);

  // ─── Fog of war: only show cells within FOG_RADIUS of player or visited ───
  const isVisible = useCallback(
    (r: number, c: number) => {
      if (won) return true; // Reveal all on win
      const dr = Math.abs(r - pos[0]);
      const dc = Math.abs(c - pos[1]);
      // Chebyshev distance for square viewport
      return Math.max(dr, dc) <= FOG_RADIUS;
    },
    [pos, won]
  );

  const isExplored = useCallback(
    (r: number, c: number) => visited.has(`${r},${c}`),
    [visited]
  );

  // Hint: briefly flash cells on the solution path near player
  const solutionSet = useMemo(() => {
    if (!solution) return new Set<string>();
    return new Set(solution.map(([r, c]) => `${r},${c}`));
  }, [solution]);

  const handleHint = useCallback(() => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 1500);
  }, []);

  // Viewport: center around player, show VIEWPORT_SIZE × VIEWPORT_SIZE cells
  const VIEWPORT_SIZE = FOG_RADIUS * 2 + 1; // 7 cells visible
  const vpSize = Math.min(GRID, VIEWPORT_SIZE * 3 + 1); // show ~21 cells, enough context

  // Compute viewport bounds (clamped to maze edges)
  const halfVp = Math.floor(vpSize / 2);
  const vpTop = Math.max(0, Math.min(pos[0] - halfVp, GRID - vpSize));
  const vpLeft = Math.max(0, Math.min(pos[1] - halfVp, GRID - vpSize));
  const vpBottom = Math.min(GRID, vpTop + vpSize);
  const vpRight = Math.min(GRID, vpLeft + vpSize);

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <p className="font-pixel text-xs text-gray-600 text-center">
        Hjelp Piip gjennom den mørke labyrinten! 🐥
      </p>
      <div className="flex gap-4 items-center">
        <p className="font-pixel text-gray-500" style={{ fontSize: 9 }}>
          Trekk: {moves}
        </p>
        {solution && (
          <p className="font-pixel text-gray-600" style={{ fontSize: 8 }}>
            Korteste vei: {solution.length - 1}
          </p>
        )}
      </div>

      {/* Mini-map: tiny overview of full maze */}
      <div className="relative">
        <div
          className="border border-gray-200 overflow-hidden"
          style={{ width: GRID * 2, height: GRID * 2 }}
        >
          {maze.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => {
                const isPlayer = pos[0] === r && pos[1] === c;
                const isGoal = r === GRID - 2 && c === GRID - 2;
                const explored = isExplored(r, c);
                return (
                  <div
                    key={c}
                    style={{ width: 2, height: 2 }}
                    className={
                      isPlayer
                        ? 'bg-yellow-400'
                        : isGoal
                        ? 'bg-green-400'
                        : cell === 1
                        ? 'bg-gray-800'
                        : explored
                        ? 'bg-gray-500'
                        : 'bg-gray-900'
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
        <p className="font-pixel text-gray-600 text-center mt-0.5" style={{ fontSize: 7 }}>
          OVERSIKT
        </p>
      </div>

      {/* Main viewport: fog-of-war view */}
      <div
        className="border-2 border-mc-yellow overflow-hidden rounded"
        style={{ width: (vpRight - vpLeft) * CELL, height: (vpBottom - vpTop) * CELL }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {maze.slice(vpTop, vpBottom).map((row, ri) => {
          const r = vpTop + ri;
          return (
            <div key={r} className="flex">
              {row.slice(vpLeft, vpRight).map((cell, ci) => {
                const c = vpLeft + ci;
                const isPlayer = pos[0] === r && pos[1] === c;
                const isGoal = r === GRID - 2 && c === GRID - 2;
                const visible = isVisible(r, c);
                const explored = isExplored(r, c);
                const dimExplored = !visible && explored;
                const onSolution = showHint && solutionSet.has(`${r},${c}`) && visible;

                let bg = 'bg-black'; // fog
                if (visible || dimExplored) {
                  if (cell === 1) {
                    bg = visible ? 'bg-mc-brown' : 'bg-gray-800';
                  } else {
                    bg = visible
                      ? onSolution
                        ? 'bg-yellow-900'
                        : 'bg-yellow-50'
                      : 'bg-gray-900';
                  }
                }
                if (isGoal && (visible || dimExplored)) bg = 'bg-mc-green bg-opacity-30';

                return (
                  <div
                    key={c}
                    style={{ width: CELL, height: CELL }}
                    className={`flex items-center justify-center ${bg} transition-colors duration-150`}
                  >
                    {isPlayer && <span style={{ fontSize: CELL * 0.7 }}>🐥</span>}
                    {isGoal && !isPlayer && (visible || dimExplored) && (
                      <span style={{ fontSize: CELL * 0.7 }}>🏠</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {won && (
        <p className="font-pixel text-mc-green text-xs text-center animate-bounce">
          Piip fant hjem på {moves} trekk! 🎉
        </p>
      )}

      {/* Controls */}
      <div className="flex gap-6 items-start">
        {/* D-pad */}
        <div className="grid grid-cols-3 gap-1.5">
          <div />
          <button
            onClick={() => move(-1, 0)}
            className="bg-mc-dark border border-gray-600 rounded p-2.5 text-white text-sm active:bg-gray-700 select-none"
          >
            ▲
          </button>
          <div />
          <button
            onClick={() => move(0, -1)}
            className="bg-mc-dark border border-gray-600 rounded p-2.5 text-white text-sm active:bg-gray-700 select-none"
          >
            ◀
          </button>
          <button
            onClick={() => move(1, 0)}
            className="bg-mc-dark border border-gray-600 rounded p-2.5 text-white text-sm active:bg-gray-700 select-none"
          >
            ▼
          </button>
          <button
            onClick={() => move(0, 1)}
            className="bg-mc-dark border border-gray-600 rounded p-2.5 text-white text-sm active:bg-gray-700 select-none"
          >
            ▶
          </button>
        </div>

        {/* Hint button */}
        {!won && (
          <button
            onClick={handleHint}
            disabled={showHint}
            className="font-pixel text-xs text-gray-500 border border-gray-700 rounded px-3 py-2 mt-2 active:bg-gray-800 disabled:opacity-30 select-none"
          >
            💡 Hint
          </button>
        )}
      </div>
    </div>
  );
}
 