import { useRef, useEffect, useState, useCallback } from 'react';

const W = 360;
const H = 500;
const BUNNY_W = 36;
const BUNNY_H = 36;
const PLAT_W = 80;
const PLAT_H = 12;
const JUMP_VEL = -13;
const GRAVITY = 0.4;
const MOVE_SPEED = 5;
const REQUIRED_HEIGHT = 3000;

interface Platform {
  x: number;
  y: number;
  id: number;
}

function makePlatforms(): Platform[] {
  const platforms: Platform[] = [];
  // Starting platform under bunny
  platforms.push({ x: W / 2 - PLAT_W / 2, y: H - 80, id: 0 });
  let nextId = 1;
  for (let y = H - 160; y > -H * 2; y -= 70 + Math.random() * 40) {
    platforms.push({
      x: Math.random() * (W - PLAT_W),
      y,
      id: nextId++,
    });
  }
  return platforms;
}

interface Props {
  onComplete: () => void;
}

export default function BunnyJump({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    bunnyX: W / 2 - BUNNY_W / 2,
    bunnyY: H - 120,
    velY: JUMP_VEL,
    platforms: makePlatforms(),
    scrollY: 0,
    maxScrollY: 0,
    running: false,
    moveLeft: false,
    moveRight: false,
    nextPlatId: 100,
    dead: false,
  });
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [displayHeight, setDisplayHeight] = useState(0);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.bunnyX = W / 2 - BUNNY_W / 2;
    s.bunnyY = H - 120;
    s.velY = JUMP_VEL;
    s.platforms = makePlatforms();
    s.scrollY = 0;
    s.maxScrollY = 0;
    s.running = true;
    s.moveLeft = false;
    s.moveRight = false;
    s.nextPlatId = 100;
    s.dead = false;
    setDisplayHeight(0);
    setPhase('playing');
  }, []);

  // Controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) * (W / rect.width);
      stateRef.current.moveLeft = x < W / 2;
      stateRef.current.moveRight = x >= W / 2;
    };
    const onTouchEnd = () => {
      stateRef.current.moveLeft = false;
      stateRef.current.moveRight = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.moveLeft = true;
      if (e.key === 'ArrowRight') stateRef.current.moveRight = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.moveLeft = false;
      if (e.key === 'ArrowRight') stateRef.current.moveRight = false;
    };
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const loop = (ts: number) => {
      const s = stateRef.current;
      if (!s.running) return;
      const dt = Math.min((ts - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = ts;

      // Move left/right (wrap around)
      if (s.moveLeft) s.bunnyX -= MOVE_SPEED * dt;
      if (s.moveRight) s.bunnyX += MOVE_SPEED * dt;
      if (s.bunnyX > W) s.bunnyX = -BUNNY_W;
      if (s.bunnyX < -BUNNY_W) s.bunnyX = W;

      // Gravity
      s.velY += GRAVITY * dt;
      s.bunnyY += s.velY * dt;

      // Scroll world up when bunny passes half height
      if (s.bunnyY < H / 2) {
        const diff = H / 2 - s.bunnyY;
        s.bunnyY = H / 2;
        s.scrollY += diff;
        if (s.scrollY > s.maxScrollY) {
          s.maxScrollY = s.scrollY;
          const h = Math.floor(s.maxScrollY);
          setDisplayHeight(h);
          if (h >= REQUIRED_HEIGHT) {
            s.running = false;
            setPhase('won');
            setTimeout(onComplete, 800);
            return;
          }
        }
        // Move platforms down
        s.platforms.forEach(p => { p.y += diff; });
        // Remove off-screen platforms
        s.platforms = s.platforms.filter(p => p.y < H + 20);
        // Spawn new platforms at top
        const topY = Math.min(...s.platforms.map(p => p.y));
        let y = topY - (70 + Math.random() * 40);
        while (y > -50) {
          s.platforms.push({ x: Math.random() * (W - PLAT_W), y, id: s.nextPlatId++ });
          y -= 70 + Math.random() * 40;
        }
      }

      // Platform collision (only when falling)
      if (s.velY > 0) {
        for (const p of s.platforms) {
          if (
            s.bunnyX + BUNNY_W > p.x + 4 &&
            s.bunnyX < p.x + PLAT_W - 4 &&
            s.bunnyY + BUNNY_H >= p.y &&
            s.bunnyY + BUNNY_H <= p.y + PLAT_H + 8
          ) {
            s.velY = JUMP_VEL;
            s.bunnyY = p.y - BUNNY_H;
            break;
          }
        }
      }

      // Death: fell below screen
      if (s.bunnyY > H + 50) {
        s.running = false;
        setPhase('lost');
        return;
      }

      // Draw
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // Height indicator
      const progress = Math.min(s.maxScrollY / REQUIRED_HEIGHT, 1);
      ctx.fillStyle = '#2a2a4e';
      ctx.fillRect(W - 12, 0, 12, H);
      ctx.fillStyle = '#5c8a1e';
      ctx.fillRect(W - 12, H - H * progress, 12, H * progress);
      ctx.fillStyle = '#f5c518';
      ctx.fillRect(W - 12, H - H * progress - 3, 12, 6);

      // Platforms
      for (const p of s.platforms) {
        ctx.fillStyle = '#5c8a1e';
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, PLAT_W, PLAT_H, 4);
        ctx.fill();
        ctx.fillStyle = '#7ab82e';
        ctx.fillRect(p.x + 4, p.y + 2, PLAT_W - 8, 3);
      }

      // Bunny (emoji)
      ctx.font = `${BUNNY_W}px serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('🐇', s.bunnyX, s.bunnyY);

      // Divider
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();

      animRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, onComplete]);

  const scale = Math.min(1, (Math.min(window.innerWidth, 420) - 32) / W);
  const pct = Math.min(100, Math.round((displayHeight / REQUIRED_HEIGHT) * 100));

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-pixel text-xs text-mc-yellow">📏 {displayHeight}/{REQUIRED_HEIGHT}</span>
        <span className="font-pixel text-xs text-mc-green">{pct}%</span>
      </div>

      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', height: H * scale }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-lg border-2 border-gray-700 touch-none block"
        />
      </div>

      {phase === 'idle' && (
        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="font-pixel text-xs text-gray-400 text-center leading-relaxed max-w-xs">
            Trykk venstre/høyre side for å styre.<br />Hopp opp til høyde {REQUIRED_HEIGHT}!
          </p>
          <button onClick={startGame} className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
            START →
          </button>
        </div>
      )}
      {phase === 'won' && <p className="font-pixel text-mc-green text-xs text-center">🎉 Du nådde toppen!</p>}
      {phase === 'lost' && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-pixel text-red-400 text-xs text-center">Du falt! Høyde: {displayHeight}</p>
          <button onClick={startGame} className="bg-mc-yellow text-black font-pixel text-xs py-3 px-8 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1">
            PRØV IGJEN
          </button>
        </div>
      )}
    </div>
  );
}
