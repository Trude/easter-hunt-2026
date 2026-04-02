import { useRef, useEffect, useState, useCallback } from 'react';
import odinSitSrc from '../../assets/odin_sit.png';
import odinJumpSrc from '../../assets/odin_jump.png';

const W = 360;
const H = 500;
const BUNNY_W = 36;
const BUNNY_H = 36;
const JUMP_VEL = -13;
const GRAVITY = 0.4;
const MOVE_SPEED = 5;
const REQUIRED_HEIGHT = 2500;

// ─── Difficulty tiers every 500 height ──────────────────────
interface Tier {
  lavaSpeed: number;      // px per frame-tick the lava rises
  platMinW: number;       // min platform width
  platMaxW: number;       // max platform width
  platGapMin: number;     // min vertical gap between platforms
  platGapMax: number;     // max vertical gap
  movingChance: number;   // chance a platform moves horizontally
  crumbleChance: number;  // chance a platform crumbles after landing
  windStrength: number;   // horizontal wind force
  darkChance: number;     // chance of "dark zone" (dimmed visibility)
}

function getTier(height: number): Tier {
  const level = Math.floor(height / 500);
  return {
    lavaSpeed:     Math.min(0.9 + level * 0.43, 5.8),
    platMinW:      Math.max(20, 60 - level * 8),
    platMaxW:      Math.max(30, 70 - level * 8),
    platGapMin:    60 + Math.min(level * 4, 30),
    platGapMax:    90 + Math.min(level * 6, 40),
    movingChance:  Math.min(level * 0.08, 0.45),
    crumbleChance: Math.min(Math.max(0, (level - 1) * 0.1), 0.4),
    windStrength:  level >= 3 ? Math.min((level - 2) * 1.2, 4.5) : 0,
    darkChance:    level >= 4 ? Math.min((level - 3) * 0.15, 0.5) : 0,
  };
}

// ─── Platform types ─────────────────────────────────────────
interface Platform {
  x: number;
  y: number;
  w: number;
  id: number;
  type: 'normal' | 'moving' | 'crumble';
  moveDir?: number;     // -1 or 1
  moveSpeed?: number;
  crumbleTimer?: number; // frames left before it disappears
  crumbling?: boolean;
}

function makePlatform(
  x: number, y: number, w: number, id: number, tier: Tier
): Platform {
  const r = Math.random();
  if (r < tier.crumbleChance) {
    return { x, y, w, id, type: 'crumble' };
  }
  if (r < tier.crumbleChance + tier.movingChance) {
    return {
      x, y, w, id,
      type: 'moving',
      moveDir: Math.random() < 0.5 ? -1 : 1,
      moveSpeed: 1.2 + Math.random() * 1.5,
    };
  }
  return { x, y, w, id, type: 'normal' };
}

function makeInitialPlatforms(): Platform[] {
  const platforms: Platform[] = [];
  const tier = getTier(0);
  // Safe starting platform (wide, centered)
  platforms.push({ x: W / 2 - 45, y: H - 80, w: 90, id: 0, type: 'normal' });
  let nextId = 1;
  for (let y = H - 160; y > -H * 2; y -= tier.platGapMin + Math.random() * (tier.platGapMax - tier.platGapMin)) {
    const w = tier.platMinW + Math.random() * (tier.platMaxW - tier.platMinW);
    platforms.push(makePlatform(
      Math.random() * (W - w), y, w, nextId++, tier
    ));
  }
  return platforms;
}

// ─── Wind indicator ─────────────────────────────────────────
function drawWind(ctx: CanvasRenderingContext2D, strength: number, time: number) {
  if (strength <= 0) return;
  ctx.save();
  const windVal = Math.sin(time * 0.0004);
  const absWind = Math.abs(windVal);
  ctx.globalAlpha = 0.15 + absWind * 0.35;
  ctx.strokeStyle = '#88ccff';
  ctx.lineWidth = 1 + absWind * 2;
  const dir = windVal > 0 ? 1 : -1;
  const streakLen = 20 + absWind * strength * 25;
  for (let i = 0; i < 10; i++) {
    const yy = 30 + i * 45 + Math.sin(time * 0.002 + i) * 15;
    const xx = dir > 0 ? 10 + Math.random() * 30 : W - 10 - Math.random() * 30;
    ctx.beginPath();
    ctx.moveTo(xx, yy);
    ctx.lineTo(xx + dir * streakLen, yy);
    ctx.stroke();
    // arrowhead
    ctx.beginPath();
    ctx.moveTo(xx + dir * streakLen, yy);
    ctx.lineTo(xx + dir * (streakLen - 8), yy - 4);
    ctx.moveTo(xx + dir * streakLen, yy);
    ctx.lineTo(xx + dir * (22 + strength * 60), yy + 4);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Lava drawing ───────────────────────────────────────────
function drawLava(ctx: CanvasRenderingContext2D, lavaY: number, time: number) {
  if (lavaY >= H + 20) return;
  const waveH = 6;
  // Glow above lava
  const grad = ctx.createLinearGradient(0, lavaY - 40, 0, lavaY);
  grad.addColorStop(0, 'rgba(255, 60, 0, 0)');
  grad.addColorStop(1, 'rgba(255, 60, 0, 0.15)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, lavaY - 40, W, 40);

  // Wave surface
  ctx.beginPath();
  ctx.moveTo(0, lavaY);
  for (let x = 0; x <= W; x += 4) {
    const wave = Math.sin(x * 0.03 + time * 0.004) * waveH +
                 Math.sin(x * 0.07 + time * 0.006) * (waveH * 0.5);
    ctx.lineTo(x, lavaY + wave);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  const lavaGrad = ctx.createLinearGradient(0, lavaY, 0, H);
  lavaGrad.addColorStop(0, '#ff4400');
  lavaGrad.addColorStop(0.3, '#ff2200');
  lavaGrad.addColorStop(0.7, '#cc1100');
  lavaGrad.addColorStop(1, '#880800');
  ctx.fillStyle = lavaGrad;
  ctx.fill();

  // Bright hotspots
  ctx.globalAlpha = 0.4 + Math.sin(time * 0.005) * 0.2;
  for (let i = 0; i < 5; i++) {
    const bx = (i * 73 + time * 0.3) % W;
    const by = lavaY + 10 + Math.sin(time * 0.003 + i) * 5;
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(bx, by, 4 + Math.sin(time * 0.008 + i * 2) * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── Dark zone overlay ──────────────────────────────────────
function drawDarkOverlay(ctx: CanvasRenderingContext2D, bunnyX: number, bunnyY: number) {
  // Radial gradient spotlight on bunny
  const cx = bunnyX + BUNNY_W / 2;
  const cy = bunnyY + BUNNY_H / 2;
  const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 160);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.6, 'rgba(0,0,0,0.5)');
  grad.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

// ─── Component ──────────────────────────────────────────────
interface Props {
  onComplete: () => void;
}

export default function LavaFloor({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sitImgRef  = useRef<HTMLImageElement | null>(null);
  const jumpImgRef = useRef<HTMLImageElement | null>(null);

  // Preload Odin images once
  useEffect(() => {
    const sit = new Image();
    sit.src = odinSitSrc;
    sitImgRef.current = sit;
    const jump = new Image();
    jump.src = odinJumpSrc;
    jumpImgRef.current = jump;
  }, []);

  const stateRef = useRef({
    bunnyX: W / 2 - BUNNY_W / 2,
    bunnyY: H - 120,
    velY: JUMP_VEL,
    platforms: makeInitialPlatforms(),
    scrollY: 0,
    maxScrollY: 0,
    running: false,
    moveLeft: false,
    moveRight: false,
    nextPlatId: 200,
    dead: false,
    lavaScreenY: H + 100,   // lava position in screen coords (starts below screen)
    lavaWorldY: 0,          // how much lava has risen in world coords
    windPhase: 0,
    inDarkZone: false,
    darkZoneEnd: 0,
    deathReason: '' as string,
    completed: false,
  });
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [displayHeight, setDisplayHeight] = useState(0);
  const [deathMsg, setDeathMsg] = useState('');
  const [tierLevel, setTierLevel] = useState(0);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const gameTimeRef = useRef<number>(0);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.bunnyX = W / 2 - BUNNY_W / 2;
    s.bunnyY = H - 120;
    s.velY = JUMP_VEL;
    s.platforms = makeInitialPlatforms();
    s.scrollY = 0;
    s.maxScrollY = 0;
    s.running = true;
    s.moveLeft = false;
    s.moveRight = false;
    s.nextPlatId = 200;
    s.dead = false;
    s.lavaScreenY = H + 100;
    s.lavaWorldY = 0;
    s.windPhase = 0;
    s.inDarkZone = false;
    s.darkZoneEnd = 0;
    s.deathReason = '';
    s.completed = false;
    gameTimeRef.current = 0;
    setDisplayHeight(0);
    setTierLevel(0);
    setDeathMsg('');
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
      const rawDt = (ts - lastTimeRef.current) / 16.67;
      const dt = Math.min(rawDt, 3);
      lastTimeRef.current = ts;
      gameTimeRef.current += dt * 16.67;
      const time = gameTimeRef.current;

      const tier = getTier(s.maxScrollY);
      const currentLevel = Math.floor(s.maxScrollY / 500);
      setTierLevel(currentLevel);

      // ── Wind (slow oscillation so it really pushes you) ──
      const windDir = Math.sin(time * 0.0004);
      const windForce = tier.windStrength * windDir;

      // ── Move left/right + wind ──
      if (s.moveLeft) s.bunnyX -= MOVE_SPEED * dt;
      if (s.moveRight) s.bunnyX += MOVE_SPEED * dt;
      s.bunnyX += windForce * dt;
      // Wrap around
      if (s.bunnyX > W) s.bunnyX = -BUNNY_W;
      if (s.bunnyX < -BUNNY_W) s.bunnyX = W;

      // ── Gravity ──
      s.velY += GRAVITY * dt;
      s.bunnyY += s.velY * dt;

      // ── Move moving platforms ──
      for (const p of s.platforms) {
        if (p.type === 'moving' && p.moveDir !== undefined && p.moveSpeed) {
          p.x += p.moveDir * p.moveSpeed * dt;
          if (p.x <= 0) { p.x = 0; p.moveDir = 1; }
          if (p.x + p.w >= W) { p.x = W - p.w; p.moveDir = -1; }
        }
        // Crumbling countdown
        if (p.type === 'crumble' && p.crumbling && p.crumbleTimer !== undefined) {
          p.crumbleTimer -= dt;
        }
      }
      // Remove fully crumbled platforms
      s.platforms = s.platforms.filter(p =>
        !(p.type === 'crumble' && p.crumbling && p.crumbleTimer !== undefined && p.crumbleTimer <= 0)
      );

      // ── Scroll world up ──
      if (s.bunnyY < H / 2) {
        const diff = H / 2 - s.bunnyY;
        s.bunnyY = H / 2;
        s.scrollY += diff;
        if (s.scrollY > s.maxScrollY) {
          s.maxScrollY = s.scrollY;
          const h = Math.floor(s.maxScrollY);
          setDisplayHeight(h);
          // Fire onComplete once when passing REQUIRED_HEIGHT (unlocks dept)
          // but keep playing — the game is endless!
          if (h >= REQUIRED_HEIGHT && !s.completed) {
            s.completed = true;
            onComplete();
          }
        }
        // Move platforms & lava down with scroll
        s.platforms.forEach(p => { p.y += diff; });
        s.lavaScreenY += diff;

        // Remove off-screen platforms
        s.platforms = s.platforms.filter(p => p.y < H + 20);

        // Spawn new platforms at top
        const topY = s.platforms.length > 0 ? Math.min(...s.platforms.map(p => p.y)) : 0;
        const spawnTier = getTier(s.maxScrollY);
        let y = topY - (spawnTier.platGapMin + Math.random() * (spawnTier.platGapMax - spawnTier.platGapMin));
        while (y > -80) {
          const w = spawnTier.platMinW + Math.random() * (spawnTier.platMaxW - spawnTier.platMinW);
          s.platforms.push(makePlatform(
            Math.random() * (W - w), y, w, s.nextPlatId++, spawnTier
          ));
          y -= spawnTier.platGapMin + Math.random() * (spawnTier.platGapMax - spawnTier.platGapMin);
        }
      }

      // ── Platform collision (only when falling) ──
      if (s.velY > 0) {
        for (const p of s.platforms) {
          if (p.type === 'crumble' && p.crumbling && p.crumbleTimer !== undefined && p.crumbleTimer < 5) continue;
          if (
            s.bunnyX + BUNNY_W > p.x + 4 &&
            s.bunnyX < p.x + p.w - 4 &&
            s.bunnyY + BUNNY_H >= p.y &&
            s.bunnyY + BUNNY_H <= p.y + 12 + 8
          ) {
            s.velY = JUMP_VEL;
            s.bunnyY = p.y - BUNNY_H;
            // Start crumble timer on landing
            if (p.type === 'crumble' && !p.crumbling) {
              p.crumbling = true;
              p.crumbleTimer = 25; // ~25 ticks before it vanishes
            }
            break;
          }
        }
      }

      // ── Rising lava ──
      const lavaRise = tier.lavaSpeed * dt;
      s.lavaScreenY -= lavaRise;
      s.lavaWorldY += lavaRise;
      // Don't let lava go above top of screen
      if (s.lavaScreenY < -20) s.lavaScreenY = -20;

      // ── Dark zone toggling ──
      if (tier.darkChance > 0 && !s.inDarkZone && Math.random() < tier.darkChance * 0.002) {
        s.inDarkZone = true;
        s.darkZoneEnd = time + 3000 + Math.random() * 2000;
      }
      if (s.inDarkZone && time > s.darkZoneEnd) {
        s.inDarkZone = false;
      }

      // ── Death checks ──
      // 1) Fell below screen
      if (s.bunnyY > H + 50) {
        s.running = false;
        s.deathReason = 'Du falt! 💀';
        setDeathMsg(s.deathReason);
        setPhase('lost');
        return;
      }
      // 2) Touched lava
      if (s.bunnyY + BUNNY_H > s.lavaScreenY + 4) {
        s.running = false;
        s.deathReason = 'Slukt av lavaen! 🌋';
        setDeathMsg(s.deathReason);
        setPhase('lost');
        return;
      }

      // ════════════════════════════════════════════
      //  D R A W I N G
      // ════════════════════════════════════════════

      // Background — gets darker/redder as lava approaches
      const lavaProximity = Math.max(0, 1 - (s.lavaScreenY - s.bunnyY) / H);
      // Light sky-blue base, shifts warm as lava approaches
      const bgR = Math.floor(186 + lavaProximity * 69);
      const bgG = Math.floor(225 - lavaProximity * 105);
      const bgB = Math.floor(255 - lavaProximity * 155);
      ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
      ctx.fillRect(0, 0, W, H);

      // Wind streaks
      drawWind(ctx, tier.windStrength, time);

      // Height indicator bar (right edge)
      const barX = W - 14;
      const barW = 14;
      // Height bar scales: use max of REQUIRED_HEIGHT or current height + buffer
      const barMax = Math.max(REQUIRED_HEIGHT, s.maxScrollY + 500);
      const progress = Math.min(s.maxScrollY / barMax, 1);
      const lavaProgress = Math.max(0, Math.min(progress, s.lavaWorldY / barMax));

      // Bar background
      ctx.fillStyle = 'rgba(100,160,220,0.3)';
      ctx.fillRect(barX, 0, barW, H);

      // Lava fill (red, from bottom up to lava height)
      if (lavaProgress > 0) {
        const lavaGrad = ctx.createLinearGradient(0, H, 0, H - H * lavaProgress);
        lavaGrad.addColorStop(0, '#880800');
        lavaGrad.addColorStop(0.5, '#cc2200');
        lavaGrad.addColorStop(1, '#ff4400');
        ctx.fillStyle = lavaGrad;
        ctx.fillRect(barX, H - H * lavaProgress, barW, H * lavaProgress);
      }

      // Bunny height (green, from lava top up to bunny height)
      const safeZone = progress - lavaProgress;
      if (safeZone > 0) {
        ctx.fillStyle = '#5c8a1e';
        ctx.fillRect(barX, H - H * progress, barW, H * safeZone);
      }

      // Bunny marker (yellow dot)
      ctx.fillStyle = '#f5c518';
      ctx.fillRect(barX, H - H * progress - 3, barW, 6);

      // Lava marker (red flashing line)
      if (lavaProgress > 0) {
        ctx.fillStyle = Math.sin(time * 0.008) > 0 ? '#ff4400' : '#ff8800';
        ctx.fillRect(barX - 2, H - H * lavaProgress - 2, barW + 4, 4);
        // Lava emoji
        ctx.font = '8px serif';
        ctx.textAlign = 'right';
        ctx.fillText('🔥', barX - 2, H - H * lavaProgress + 3);
      }

      // Goal line (REQUIRED_HEIGHT marker)
      const goalY = H - H * Math.min(REQUIRED_HEIGHT / barMax, 1);
      ctx.strokeStyle = s.completed ? '#5c8a1e' : '#f5c518';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(barX, goalY);
      ctx.lineTo(barX + barW, goalY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '7px sans-serif';
      ctx.fillStyle = s.completed ? '#5c8a1e' : '#f5c518';
      ctx.textAlign = 'right';
      ctx.fillText(s.completed ? '✓' : `${REQUIRED_HEIGHT}m`, barX - 2, goalY + 3);

      // Bar border
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, 0, barW, H);

      // ── Platforms ──
      for (const p of s.platforms) {
        if (p.y > H + 10 || p.y < -20) continue;
        ctx.save();

        if (p.type === 'crumble') {
          // Crumbling: shake + fade
          if (p.crumbling && p.crumbleTimer !== undefined) {
            const shake = (Math.random() - 0.5) * 4;
            ctx.translate(shake, shake * 0.5);
            ctx.globalAlpha = Math.max(0, p.crumbleTimer / 25);
          }
          ctx.fillStyle = '#8B6914';
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, 12, 3);
          ctx.fill();
          // Crack lines
          ctx.strokeStyle = '#5a4010';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x + p.w * 0.3, p.y + 2);
          ctx.lineTo(p.x + p.w * 0.5, p.y + 10);
          ctx.moveTo(p.x + p.w * 0.7, p.y + 1);
          ctx.lineTo(p.x + p.w * 0.6, p.y + 11);
          ctx.stroke();
        } else if (p.type === 'moving') {
          // Moving: blue tint
          ctx.fillStyle = '#3a7abf';
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, 12, 4);
          ctx.fill();
          ctx.fillStyle = '#5a9adf';
          ctx.fillRect(p.x + 4, p.y + 2, p.w - 8, 3);
          // Direction arrows
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.font = '8px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.moveDir === 1 ? '→' : '←', p.x + p.w / 2, p.y + 10);
        } else {
          // Normal: green
          ctx.fillStyle = '#5c8a1e';
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, 12, 4);
          ctx.fill();
          ctx.fillStyle = '#7ab82e';
          ctx.fillRect(p.x + 4, p.y + 2, p.w - 8, 3);
        }
        ctx.restore();
      }

      // ── Odin ──
      const odinImg = s.velY < 0 ? jumpImgRef.current : sitImgRef.current;
      if (odinImg?.complete && odinImg.naturalWidth > 0) {
        ctx.drawImage(odinImg, s.bunnyX, s.bunnyY, BUNNY_W, BUNNY_H);
      } else {
        ctx.font = `${BUNNY_W}px serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('🐕', s.bunnyX, s.bunnyY);
      }

      // ── Lava ──
      drawLava(ctx, s.lavaScreenY, time);

      // ── Dark zone overlay ──
      if (s.inDarkZone) {
        drawDarkOverlay(ctx, s.bunnyX, s.bunnyY);
      }

      // ── Tier-up flash ──
      // (handled via React state, not canvas)

      // Touch divider
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();

      // ── HUD overlay ──
      // Lava distance warning
      const distToLava = s.lavaScreenY - (s.bunnyY + BUNNY_H);
      if (distToLava < 120 && distToLava > 0) {
        ctx.globalAlpha = Math.max(0, 1 - distToLava / 120) * 0.6;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, H - 4, W, 4);
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, onComplete]);

  const scale = Math.min(1, (Math.min(window.innerWidth, 420) - 32) / W);
  const pastGoal = displayHeight >= REQUIRED_HEIGHT;

  const tierNames = ['Normal', 'Raskere lava', 'Urolige plattformer', 'Vind!', 'Mørke soner', 'Helvete', 'RAGNARØK'];
  const tierName = tierNames[Math.min(tierLevel, tierNames.length - 1)];

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="flex justify-between w-full max-w-sm items-end">
        <span className="font-pixel text-xs text-mc-yellow">
          📏 {displayHeight}m
        </span>
        {pastGoal && (
          <span className="font-pixel text-mc-green" style={{ fontSize: 9 }}>
            ✅ Avdeling godkjent!
          </span>
        )}
      </div>

      {phase === 'playing' && tierLevel > 0 && (
        <div className="flex items-center gap-2">
          <span className="font-pixel text-red-400" style={{ fontSize: 9 }}>
            🔥 NIVÅ {tierLevel}: {tierName}
          </span>
        </div>
      )}

      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', height: H * scale }} className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-lg border-2 border-gray-700 touch-none block"
        />
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/60">
            <p className="font-pixel text-xs text-white text-center leading-relaxed px-6">
              Trykk venstre/høyre side for å styre.<br /><br />
              Nå {REQUIRED_HEIGHT}m for å klare avdelingen!<br /><br />
              <span className="text-red-400">Pass opp for lavaen! 🌋</span>
            </p>
            <div className="font-pixel text-gray-400 text-center leading-relaxed" style={{ fontSize: 8 }}>
              <p>🟢 Grønn = vanlig</p>
              <p>🔵 Blå = beveger seg</p>
              <p>🟤 Brun = smuldrer opp!</p>
            </div>
            <button onClick={startGame} className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
              START →
            </button>
          </div>
        )}
        {phase === 'lost' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/70">
            <p className="font-pixel text-red-400 text-xs text-center px-4">{deathMsg}</p>
            <div className="text-center">
              <p className="font-pixel text-gray-400" style={{ fontSize: 8 }}>HØYDE</p>
              <p className="font-pixel text-mc-yellow text-lg">{displayHeight}m</p>
              {tierLevel > 0 && (
                <p className="font-pixel text-gray-500 mt-1" style={{ fontSize: 8 }}>
                  Nivå {tierLevel}: {tierName}
                </p>
              )}
              {pastGoal && (
                <p className="font-pixel text-mc-green mt-1" style={{ fontSize: 8 }}>
                  ✅ Avdeling godkjent!
                </p>
              )}
            </div>
            <button onClick={startGame} className="bg-mc-yellow text-black font-pixel text-xs py-3 px-8 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1">
              PRØV IGJEN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}