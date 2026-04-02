import { useRef, useEffect, useState, useCallback } from 'react';
import eggSrc from '../../assets/easteregg.png';
import basketSrc from '../../assets/basket.png';
import crowSrc from '../../assets/crow.png';

const CANVAS_W = 360;
const CANVAS_H = 480;
const BASKET_W = 80;
const BASKET_H = 60;
const BASKET_SPEED = 7;
const ITEM_RADIUS = 16;
const REQUIRED_EGGS = 20;
const GAME_DURATION = 60;
const MAX_LIVES = 5;

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'egg' | 'crow';
}

interface Props {
  onComplete: () => void;
}

export default function CatchEggs({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    basketX: CANVAS_W / 2 - BASKET_W / 2,
    items: [] as FallingItem[],
    score: 0,
    lives: MAX_LIVES,
    running: false,
    moveLeft: false,
    moveRight: false,
    nextId: 0,
    spawnTimer: 0,
  });
  const completedRef = useRef(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(MAX_LIVES);
  const [completed, setCompleted] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'lost'>('idle');
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const eggImgRef = useRef<HTMLImageElement | null>(null);
  const basketImgRef = useRef<HTMLImageElement | null>(null);
  const crowImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const egg = new Image(); egg.src = eggSrc; eggImgRef.current = egg;
    const basket = new Image(); basket.src = basketSrc; basketImgRef.current = basket;
    const crow = new Image(); crow.src = crowSrc; crowImgRef.current = crow;
  }, []);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.basketX = CANVAS_W / 2 - BASKET_W / 2;
    s.items = [];
    s.score = 0;
    s.lives = MAX_LIVES;
    s.running = true;
    s.nextId = 0;
    s.spawnTimer = 0;
    s.moveLeft = false;
    s.moveRight = false;
    completedRef.current = false;
    setDisplayScore(0);
    setDisplayLives(MAX_LIVES);
    setCompleted(false);
    setPhase('playing');
  }, []);

  // Touch + keyboard controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) * (CANVAS_W / rect.width);
      stateRef.current.moveLeft = x < CANVAS_W / 2;
      stateRef.current.moveRight = x >= CANVAS_W / 2;
    };
    const handleTouchEnd = () => {
      stateRef.current.moveLeft = false;
      stateRef.current.moveRight = false;
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.moveLeft = true;
      if (e.key === 'ArrowRight') stateRef.current.moveRight = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.moveLeft = false;
      if (e.key === 'ArrowRight') stateRef.current.moveRight = false;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const loop = (timestamp: number) => {
      const s = stateRef.current;
      if (!s.running) return;

      const dt = Math.min((timestamp - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = timestamp;

      if (s.moveLeft) s.basketX = Math.max(0, s.basketX - BASKET_SPEED * dt);
      if (s.moveRight) s.basketX = Math.min(CANVAS_W - BASKET_W, s.basketX + BASKET_SPEED * dt);

      // Spawn
      s.spawnTimer += dt;
      if (s.spawnTimer > 38) {
        s.spawnTimer = 0;
        s.items.push({
          id: s.nextId++,
          x: ITEM_RADIUS + Math.random() * (CANVAS_W - ITEM_RADIUS * 2),
          y: -ITEM_RADIUS,
          speed: 2.5 + Math.random() * 2.5,
          type: Math.random() < 0.22 ? 'crow' : 'egg',
        });
      }

      // Move + catch
      let livesChanged = false;
      s.items = s.items.filter(item => {
        item.y += item.speed * dt;
        const inBasketX = item.x >= s.basketX && item.x <= s.basketX + BASKET_W;
        const inBasketY = item.y + ITEM_RADIUS >= CANVAS_H - BASKET_H && item.y <= CANVAS_H;
        if (inBasketX && inBasketY) {
          if (item.type === 'egg') {
            s.score += 1;
            setDisplayScore(s.score);
          } else {
            s.lives -= 1;
            livesChanged = true;
          }
          return false;
        }
        // Missed egg falls past bottom
        if (item.y >= CANVAS_H + ITEM_RADIUS) {
          if (item.type === 'egg') {
            s.lives -= 1;
            livesChanged = true;
          }
          return false;
        }
        return true;
      });
      if (livesChanged) {
        s.lives = Math.max(0, s.lives);
        setDisplayLives(s.lives);
        if (s.lives === 0) {
          s.running = false;
          setPhase('lost');
          return;
        }
      }

      // Unlock completion when enough eggs caught
      if (!completedRef.current && s.score >= REQUIRED_EGGS) {
        completedRef.current = true;
        setCompleted(true);
        onComplete();
      }

      // Draw
      ctx.fillStyle = '#c8e8f8';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Divider (touch guide)
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(CANVAS_W / 2, 0);
      ctx.lineTo(CANVAS_W / 2, CANVAS_H);
      ctx.stroke();

      // Items
      const itemSize = ITEM_RADIUS * 2;
      for (const item of s.items) {
        const imgRef = item.type === 'egg' ? eggImgRef.current : crowImgRef.current;
        if (imgRef?.complete) {
          const aspect = imgRef.naturalWidth / imgRef.naturalHeight;
          const drawH = item.type === 'crow' ? itemSize * 2.0 : itemSize;
          const drawW = drawH * aspect;
          ctx.drawImage(imgRef, item.x - drawW / 2, item.y - drawH / 2, drawW, drawH);
        } else {
          ctx.font = `${itemSize}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.type === 'egg' ? '🥚' : '🐦', item.x, item.y);
        }
      }

      // Basket image
      if (basketImgRef.current?.complete) {
        ctx.drawImage(basketImgRef.current, s.basketX, CANVAS_H - BASKET_H, BASKET_W, BASKET_H);
      } else {
        ctx.font = `${BASKET_H}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('🧺', s.basketX + BASKET_W / 2, CANVAS_H);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, onComplete]);

  const scale = Math.min(1, (Math.min(window.innerWidth, 420) - 32) / CANVAS_W);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-pixel text-xs text-mc-yellow">
          🧺 {displayScore}{completed ? ' ✅' : `/${REQUIRED_EGGS}`}
        </span>
        <span className="font-pixel text-xs">{'❤️'.repeat(displayLives)}{'🖤'.repeat(MAX_LIVES - displayLives)}</span>
      </div>

      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', height: CANVAS_H * scale }} className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-lg border-2 border-gray-200 touch-none block"
        />
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/40">
            <p className="font-pixel text-xs text-white text-center leading-relaxed px-6">
              Trykk venstre/høyre side for å bevege kurven.<br /><br />Fang {REQUIRED_EGGS} egg — unngå kråkene!<br /><br />Du har {MAX_LIVES} liv ❤️<br />Miss et egg eller ta en kråke: -1 liv.
            </p>
            <button onClick={startGame} className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
              START →
            </button>
          </div>
        )}
        {phase === 'playing' && (
          <>
            <button
              onPointerDown={() => { stateRef.current.moveLeft = true; }}
              onPointerUp={() => { stateRef.current.moveLeft = false; }}
              onPointerLeave={() => { stateRef.current.moveLeft = false; }}
              className="absolute left-0 bottom-0 w-1/2 h-24 flex items-end justify-start pb-3 pl-3 select-none touch-none"
              style={{ WebkitUserSelect: 'none' }}
            >
              <span className="text-4xl opacity-40">◀</span>
            </button>
            <button
              onPointerDown={() => { stateRef.current.moveRight = true; }}
              onPointerUp={() => { stateRef.current.moveRight = false; }}
              onPointerLeave={() => { stateRef.current.moveRight = false; }}
              className="absolute right-0 bottom-0 w-1/2 h-24 flex items-end justify-end pb-3 pr-3 select-none touch-none"
              style={{ WebkitUserSelect: 'none' }}
            >
              <span className="text-4xl opacity-40">▶</span>
            </button>
          </>
        )}
        {phase === 'lost' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/60">
            <p className="font-pixel text-red-400 text-xs text-center px-4">
              {completed ? `💀 GAME OVER\n${displayScore} egg fanget!` : `💀 GAME OVER\nBare ${displayScore}/${REQUIRED_EGGS} egg!`}
            </p>
            <p className="font-pixel text-white text-xs text-center">
              {completed ? '🎉 Du klarte oppdraget!' : ''}
            </p>
            <button onClick={startGame} className="bg-mc-yellow text-black font-pixel text-xs py-3 px-8 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1">
              PRØV IGJEN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
