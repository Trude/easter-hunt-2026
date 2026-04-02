import { useRef, useEffect, useState, useCallback } from 'react';

const CANVAS_W = 360;
const CANVAS_H = 480;
const BASKET_W = 70;
const BASKET_H = 36;
const BASKET_SPEED = 7;
const ITEM_RADIUS = 16;
const REQUIRED_EGGS = 20;
const GAME_DURATION = 60;

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
    timeLeft: GAME_DURATION,
    running: false,
    moveLeft: false,
    moveRight: false,
    nextId: 0,
    spawnTimer: 0,
  });
  const [displayScore, setDisplayScore] = useState(0);
  const [displayTime, setDisplayTime] = useState(GAME_DURATION);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const secondTimerRef = useRef<number>(0);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.basketX = CANVAS_W / 2 - BASKET_W / 2;
    s.items = [];
    s.score = 0;
    s.timeLeft = GAME_DURATION;
    s.running = true;
    s.nextId = 0;
    s.spawnTimer = 0;
    s.moveLeft = false;
    s.moveRight = false;
    setDisplayScore(0);
    setDisplayTime(GAME_DURATION);
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
      s.items = s.items.filter(item => {
        item.y += item.speed * dt;
        const inBasketX = item.x >= s.basketX && item.x <= s.basketX + BASKET_W;
        const inBasketY = item.y + ITEM_RADIUS >= CANVAS_H - BASKET_H && item.y <= CANVAS_H;
        if (inBasketX && inBasketY) {
          s.score = item.type === 'egg'
            ? s.score + 1
            : Math.max(0, s.score - 1);
          setDisplayScore(s.score);
          return false;
        }
        return item.y < CANVAS_H + ITEM_RADIUS;
      });

      // Countdown
      secondTimerRef.current += dt;
      if (secondTimerRef.current >= 60) {
        secondTimerRef.current = 0;
        s.timeLeft = Math.max(0, s.timeLeft - 1);
        setDisplayTime(s.timeLeft);
        if (s.timeLeft === 0) {
          s.running = false;
          if (s.score >= REQUIRED_EGGS) {
            setPhase('won');
            setTimeout(onComplete, 800);
          } else {
            setPhase('lost');
          }
          return;
        }
      }

      // Draw
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Divider (touch guide)
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(CANVAS_W / 2, 0);
      ctx.lineTo(CANVAS_W / 2, CANVAS_H);
      ctx.stroke();

      // Items
      ctx.font = `${ITEM_RADIUS * 2}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const item of s.items) {
        ctx.fillText(item.type === 'egg' ? '🥚' : '🐦', item.x, item.y);
      }

      // Basket
      ctx.fillStyle = '#6B4226';
      ctx.beginPath();
      ctx.roundRect(s.basketX, CANVAS_H - BASKET_H, BASKET_W, BASKET_H, 6);
      ctx.fill();
      ctx.fillStyle = '#5c8a1e';
      ctx.fillRect(s.basketX + 5, CANVAS_H - BASKET_H + 5, BASKET_W - 10, 8);

      animRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    secondTimerRef.current = 0;
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, onComplete]);

  const scale = Math.min(1, (Math.min(window.innerWidth, 420) - 32) / CANVAS_W);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-pixel text-xs text-mc-yellow">🥚 {displayScore}/{REQUIRED_EGGS}</span>
        <span className="font-pixel text-xs text-gray-600">⏱ {displayTime}s</span>
      </div>

      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', height: CANVAS_H * scale }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-lg border-2 border-gray-200 touch-none block"
        />
      </div>

      {phase === 'idle' && (
        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="font-pixel text-xs text-gray-600 text-center leading-relaxed max-w-xs">
            Trykk venstre/høyre side for å bevege kurven.<br />Fang {REQUIRED_EGGS} egg — unngå kråkene!
          </p>
          <button onClick={startGame} className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
            START →
          </button>
        </div>
      )}
      {phase === 'won' && <p className="font-pixel text-mc-green text-xs text-center">🎉 KLART! {displayScore} egg fanget!</p>}
      {phase === 'lost' && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-pixel text-red-400 text-xs text-center">Bare {displayScore} egg — du trenger {REQUIRED_EGGS}!</p>
          <button onClick={startGame} className="bg-mc-yellow text-black font-pixel text-xs py-3 px-8 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1">
            PRØV IGJEN
          </button>
        </div>
      )}
    </div>
  );
}
