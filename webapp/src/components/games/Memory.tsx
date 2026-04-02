import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

// 8 bilder = 8 par = 16 kort = 4×4 grid
const IMAGES = [
  'egg', 'hare', 'kylling', 'chocklate', 'flower', 'tulip', 'odin', 'revi'
];

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function createCards(): Card[] {
  const pairs = [...IMAGES, ...IMAGES];
  return shuffle(pairs).map((image, i) => ({
    id: i,
    image,
    isFlipped: false,
    isMatched: false,
  }));
}

function formatTime(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  if (mins > 0) return `${mins}:${s.toString().padStart(2, '0')}.${tenths}`;
  return `${s}.${tenths}s`;
}

interface Props {
  onComplete: () => void;
}

export default function Memory({ onComplete }: Props) {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allMatched = cards.every(c => c.isMatched);

  // Timer tick
  useEffect(() => {
    if (startTime && !allMatched) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
    if (allMatched && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [startTime, allMatched]);

  useEffect(() => {
    if (allMatched && startTime) {
      setElapsed(Date.now() - startTime);
      setTimeout(onComplete, 800);
    }
  }, [allMatched, onComplete, startTime]);

  const handleFlip = useCallback((id: number) => {
    if (locked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flipped.length === 1 && flipped[0] === id) return;

    // Start timer on first flip
    if (!startTime) setStartTime(Date.now());

    const newFlipped = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      setLocked(true);
      setAttempts(a => a + 1);
      const [first, second] = newFlipped.map(fid => cards.find(c => c.id === fid)!);
      if (first.image === second.image) {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, isMatched: true } : c
          ));
          setFlipped([]);
          setLocked(false);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlipped([]);
          setLocked(false);
        }, 1000);
      }
      setFlipped(newFlipped);
    } else {
      setFlipped(newFlipped);
    }
  }, [cards, flipped, locked, startTime]);

  const PAIRS = IMAGES.length;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full max-w-sm">
        <p className="font-pixel text-xs text-gray-400">
          Forsøk: {attempts}
        </p>
        <p className="font-pixel text-xs text-mc-yellow">
          ⏱ {formatTime(elapsed)}
        </p>
        <p className="font-pixel text-xs text-mc-green">
          {cards.filter(c => c.isMatched).length / 2}/{PAIRS} par
        </p>
      </div>

      {/* 4×4 grid — kort fyller bredden */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
        {cards.map(card => (
          <motion.div
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`aspect-square rounded-lg cursor-pointer select-none border-2 ${
              card.isMatched ? 'border-mc-green' : 'border-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
            style={{ perspective: 600 }}
          >
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Bakside */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-mc-dark"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-2xl">🥚</span>
              </div>
              {/* Forside */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-mc-dark p-1"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <img
                  src={`/assets/memory/${card.image}.png`}
                  alt={card.image}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {allMatched && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-pixel text-mc-green text-xs">
            ALLE PAR FUNNET! 🎉
          </p>
          <p className="font-pixel text-mc-yellow text-xs mt-1">
            Tid: {formatTime(elapsed)} — {attempts} forsøk
          </p>
        </motion.div>
      )}
    </div>
  );
}
