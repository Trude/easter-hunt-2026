import { useState, useMemo, useRef, useCallback, useEffect } from 'react';

// Image is 1408×768 → AR = 11:6
// COLS=4, ROWS=3 → need PIECE_W/PIECE_H ≈ 11/8
// PIECE_W=84, PIECE_H=61 → 4×84=336, 3×61=183, AR≈1.836 ≈ 11/6 ✓
const ROWS = 3;
const COLS = 4;
const TOTAL = ROWS * COLS;
const PIECE_W = 84;
const PIECE_H = 61;
const GAP = 0;           // zero gap so tabs/notches interlock perfectly
const PAD = 4;
const MARGIN = 12;       // how far jigsaw tabs extend beyond the core piece
const SNAP_DIST = 46;
const FRAME_W = PAD * 2 + COLS * PIECE_W + (COLS - 1) * GAP;  // 344
const FRAME_H = PAD * 2 + ROWS * PIECE_H + (ROWS - 1) * GAP;  // 191
const TRAY_H = 172;
const IMAGE_SRC = '/assets/piip/piip_and_bunny.png';

const DIV_W = PIECE_W + 2 * MARGIN;  // 101
const DIV_H = PIECE_H + 2 * MARGIN;  // 80

// ---------------------------------------------------------------------------
// Precompute edge directions (module-level, deterministic)
// +1 = tab (protrudes outward), -1 = notch (indents inward), 0 = flat border
// _rightEdge[r][c]  = direction of right  edge of piece (r,c)
// _bottomEdge[r][c] = direction of bottom edge of piece (r,c)
// Neighbour relationships: piece (r,c+1).left = –_rightEdge[r][c]
//                          piece (r+1,c).top  = –_bottomEdge[r][c]
// ---------------------------------------------------------------------------
const _rightEdge: number[][] = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: COLS }, (_, c) =>
    c < COLS - 1 ? ((r + c) % 2 === 0 ? 1 : -1) : 0
  )
);
const _bottomEdge: number[][] = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: COLS }, (_, c) =>
    r < ROWS - 1 ? ((r + c + 1) % 2 === 0 ? 1 : -1) : 0
  )
);

function getTabs(pieceIdx: number) {
  const row = Math.floor(pieceIdx / COLS);
  const col = pieceIdx % COLS;
  return {
    top:    row === 0      ? 0 : -_bottomEdge[row - 1][col],
    right:  _rightEdge[row][col],
    bottom: _bottomEdge[row][col],
    left:   col === 0      ? 0 : -_rightEdge[row][col - 1],
  };
}

// ---------------------------------------------------------------------------
// SVG path for one jigsaw piece (in the div's local coords)
// The "core" rect is (MARGIN, MARGIN) → (MARGIN+PIECE_W, MARGIN+PIECE_H)
// ---------------------------------------------------------------------------
function makePath(tabs: ReturnType<typeof getTabs>): string {
  const M = MARGIN;
  const W = PIECE_W;
  const H = PIECE_H;

  // Tab geometry (same formula for both axes)
  const tw_h = W * 0.30;   // tab width  along horizontal edges
  const th_h = M * 0.88;   // tab height perpendicular to horizontal edges
  const tw_v = H * 0.30;   // tab width  along vertical edges
  const th_v = M * 0.88;   // tab height perpendicular to vertical edges

  // Horizontal edge from (x1,y) to (x2,y)
  // dir +1 → bump upward (y decreases), dir −1 → bump downward, 0 → flat
  const hEdge = (x1: number, y: number, x2: number, dir: number) => {
    if (dir === 0) return `L ${x2} ${y} `;
    const cx = (x1 + x2) / 2;
    const ty = y - dir * th_h;
    return (
      `L ${cx - tw_h / 2} ${y} ` +
      `C ${cx - tw_h / 2} ${ty} ${cx + tw_h / 2} ${ty} ${cx + tw_h / 2} ${y} ` +
      `L ${x2} ${y} `
    );
  };

  // Vertical edge from (x,y1) to (x,y2)
  // dir +1 → bump rightward (x increases), dir −1 → bump leftward, 0 → flat
  const vEdge = (x: number, y1: number, y2: number, dir: number) => {
    if (dir === 0) return `L ${x} ${y2} `;
    const cy = (y1 + y2) / 2;
    const tx = x + dir * th_v;
    return (
      `L ${x} ${cy - tw_v / 2} ` +
      `C ${tx} ${cy - tw_v / 2} ${tx} ${cy + tw_v / 2} ${x} ${cy + tw_v / 2} ` +
      `L ${x} ${y2} `
    );
  };

  const L = M, T = M, R = M + W, B = M + H;

  // Traverse clockwise: top → right → bottom (reversed) → left (reversed)
  let path = `M ${L} ${T} `;
  path += hEdge(L, T, R,  tabs.top);      // top:    +1 → up
  path += vEdge(R, T, B,  tabs.right);    // right:  +1 → right
  path += hEdge(R, B, L, -tabs.bottom);   // bottom: +1 bottom tab → downward = −dir in hEdge
  path += vEdge(L, B, T, -tabs.left);     // left:   +1 left tab   → leftward  = −dir in vEdge
  path += 'Z';
  return path;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type PiecePos =
  | { state: 'tray' }
  | { state: 'floating'; x: number; y: number }
  | { state: 'placed' };

interface Props {
  onComplete: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Puzzle({ onComplete }: Props) {
  const trayOrder = useMemo(
    () => shuffle(Array.from({ length: TOTAL }, (_, i) => i)),
    []
  );

  // Stable random pile layout for tray pieces
  const pileLayout = useMemo(() => {
    const layouts: Record<number, { x: number; y: number; rot: number }> = {};
    trayOrder.forEach(pieceIdx => {
      layouts[pieceIdx] = {
        x: MARGIN + Math.random() * Math.max(0, FRAME_W - DIV_W - 2 * MARGIN),
        y: MARGIN + Math.random() * Math.max(0, TRAY_H - DIV_H - 2 * MARGIN),
        rot: (Math.random() - 0.5) * 28,
      };
    });
    return layouts;
  }, []);

  const [positions, setPositions] = useState<PiecePos[]>(
    Array(TOTAL).fill({ state: 'tray' } as PiecePos)
  );
  const [solved, setSolved] = useState(false);
  const [revealFull, setRevealFull] = useState(false);

  const dragRef = useRef<{ pieceId: number; offsetX: number; offsetY: number } | null>(null);
  const [dragPieceId, setDragPieceId] = useState<number | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const trayPieces = trayOrder.filter(
    i => positions[i].state === 'tray' && dragPieceId !== i
  );

  // Build pieceStyle: extended div + clip-path
  const pieceStyle = (pieceIdx: number): React.CSSProperties => {
    const row = Math.floor(pieceIdx / COLS);
    const col = pieceIdx % COLS;
    const tabs = getTabs(pieceIdx);
    return {
      backgroundImage: `url(${IMAGE_SRC})`,
      backgroundSize: `${COLS * PIECE_W}px ${ROWS * PIECE_H}px`,
      // Shift bg so the "core" area (starting at MARGIN in the div) shows the correct slice
      backgroundPosition: `${MARGIN - col * PIECE_W}px ${MARGIN - row * PIECE_H}px`,
      width: DIV_W,
      height: DIV_H,
      flexShrink: 0,
      clipPath: `path("${makePath(tabs)}")`,
    };
  };

  const startDrag = (pieceId: number, clientX: number, clientY: number, rect: DOMRect) => {
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    dragRef.current = { pieceId, offsetX, offsetY };
    setDragPieceId(pieceId);
    setDragPos({ x: clientX - offsetX, y: clientY - offsetY });
    setPositions(prev => {
      const next = [...prev];
      if (next[pieceId].state !== 'placed') next[pieceId] = { state: 'tray' };
      return next;
    });
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragRef.current) return;
    const { offsetX, offsetY, pieceId } = dragRef.current;
    setDragPos({ x: clientX - offsetX, y: clientY - offsetY });
    setDragPieceId(pieceId);
  }, []);

  const handleDrop = useCallback((clientX: number, clientY: number) => {
    const drag = dragRef.current;
    dragRef.current = null;
    setDragPieceId(null);
    setDragPos(null);
    if (!drag || !frameRef.current) return;

    const { pieceId, offsetX, offsetY } = drag;
    // Center of the piece core (the div is MARGIN larger on each side)
    const pieceCX = clientX - offsetX + MARGIN + PIECE_W / 2;
    const pieceCY = clientY - offsetY + MARGIN + PIECE_H / 2;
    const fr = frameRef.current.getBoundingClientRect();

    // Snap to correct slot?
    const col = pieceId % COLS;
    const row = Math.floor(pieceId / COLS);
    const slotCX = fr.left + PAD + col * (PIECE_W + GAP) + PIECE_W / 2;
    const slotCY = fr.top  + PAD + row * (PIECE_H + GAP) + PIECE_H / 2;

    if (Math.hypot(pieceCX - slotCX, pieceCY - slotCY) < SNAP_DIST) {
      setPositions(prev => {
        const next = [...prev];
        next[pieceId] = { state: 'placed' };
        if (next.every(p => p.state === 'placed')) {
          setSolved(true);
          setTimeout(() => setRevealFull(true), 500);
          setTimeout(onComplete, 2200);
        }
        return next;
      });
      return;
    }

    // Stay floating inside the frame?
    const dropX = clientX - offsetX - fr.left;
    const dropY = clientY - offsetY - fr.top;
    if (
      dropX > -DIV_W / 2 && dropX < FRAME_W - DIV_W / 2 &&
      dropY > -DIV_H / 2 && dropY < FRAME_H - DIV_H / 2
    ) {
      setPositions(prev => {
        const next = [...prev];
        next[pieceId] = { state: 'floating', x: dropX, y: dropY };
        return next;
      });
    }
    // Otherwise back to tray (already set in startDrag)
  }, [onComplete]);

  useEffect(() => {
    const onPM = (e: PointerEvent) => handleMove(e.clientX, e.clientY);
    const onPU = (e: PointerEvent) => handleDrop(e.clientX, e.clientY);
    window.addEventListener('pointermove', onPM);
    window.addEventListener('pointerup', onPU);
    return () => {
      window.removeEventListener('pointermove', onPM);
      window.removeEventListener('pointerup', onPU);
    };
  }, [handleMove, handleDrop]);

  return (
    <div className="flex flex-col items-center gap-4 p-2 select-none">
      <p className="font-pixel text-xs text-gray-600 text-center leading-relaxed">
        Sett sammen bildet av Piip og Påskeharen! 🧩
      </p>

      {/* Puzzle frame */}
      <div
        ref={frameRef}
        className="border-2 border-mc-yellow rounded-lg bg-gray-100 relative overflow-hidden"
        style={{ width: FRAME_W, height: FRAME_H }}
      >
        {positions.map((pos, pieceIdx) => {
          if (pos.state === 'tray') return null;
          const col = pieceIdx % COLS;
          const row = Math.floor(pieceIdx / COLS);
          // Subtract MARGIN so the "core" area aligns with the grid slot
          const x = pos.state === 'placed'
            ? PAD + col * (PIECE_W + GAP) - MARGIN
            : pos.x;
          const y = pos.state === 'placed'
            ? PAD + row * (PIECE_H + GAP) - MARGIN
            : pos.y;
          const isFloating = pos.state === 'floating';
          return (
            <div
              key={pieceIdx}
              onPointerDown={isFloating ? e => {
                e.preventDefault();
                startDrag(pieceIdx, e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
              } : undefined}
              className={`absolute touch-none ${isFloating ? 'cursor-grab' : ''}`}
              style={{
                ...pieceStyle(pieceIdx),
                left: x,
                top: y,
                filter: isFloating ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))' : undefined,
              }}
            />
          );
        })}

        {/* Full-image reveal overlay when solved */}
        {solved && (
          <div
            className="absolute inset-0 rounded-md pointer-events-none"
            style={{
              backgroundImage: `url(${IMAGE_SRC})`,
              backgroundSize: '100% 100%',
              opacity: revealFull ? 1 : 0,
              transform: revealFull ? 'scale(1)' : 'scale(1.06)',
              transition: 'opacity 0.9s ease-out, transform 0.9s ease-out',
            }}
          />
        )}
      </div>

      {/* Tray — pile layout */}
      {trayPieces.length > 0 && (
        <div
          className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
          style={{ width: FRAME_W, height: TRAY_H }}
        >
          {trayPieces.map(pieceIdx => {
            const layout = pileLayout[pieceIdx];
            return (
              <div
                key={pieceIdx}
                onPointerDown={e => {
                  e.preventDefault();
                  startDrag(pieceIdx, e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
                }}
                className="absolute cursor-grab touch-none"
                style={{
                  ...pieceStyle(pieceIdx),
                  left: layout.x,
                  top: layout.y,
                  transform: `rotate(${layout.rot}deg)`,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
                }}
              />
            );
          })}
        </div>
      )}

      {/* Dragging ghost */}
      {dragPos && dragPieceId !== null && (
        <div
          className="fixed pointer-events-none z-50 opacity-92"
          style={{
            ...pieceStyle(dragPieceId),
            left: dragPos.x,
            top: dragPos.y,
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))',
          }}
        />
      )}

      {solved && (
        <p className="font-pixel text-mc-green text-xs text-center mt-2">
          🎉 Bildet er ferdig!
        </p>
      )}
    </div>
  );
}
