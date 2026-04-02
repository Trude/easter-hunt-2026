import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const IMAGES = [
  'egg', 'hare', 'kylling', 'chocklate', 'flower', 'tulip', 'odin', 'c', 'revi'
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

interface Props {
  onComplete: () => void;
}

export default function Memory({ onComplete }: Props) {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const allMatched = cards.every(c => c.isMatched);

  useEffect(() => {
    if (allMatched) {
      setTimeout(onComplete, 800);
    }
  }, [allMatched, onComplete]);

  const handleFlip = useCallback((id: number) => {
    if (locked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flipped.length === 1 && flipped[0] === id) return;

    const newFlipped = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      setLocked(true);
      setAttempts(a => a + 1);
      const [first, second] = newFlipped.map(fid => cards.find(c => c.id === fid)!);
      if (first.image === second.image) {
        // Match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, isMatched: true } : c
          ));
          setFlipped([]);
          setLocked(false);
        }, 600);
      } else {
        // No match
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
  }, [cards, flipped, locked]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full max-w-xs">
        <p className="font-pixel text-xs text-gray-600">
          Forsøk: {attempts}
        </p>
        <p className="font-pixel text-xs text-mc-green">
          {cards.filter(c => c.isMatched).length / 2}/9 par
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
        {cards.map(card => (
          <motion.div
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg cursor-pointer select-none border-2 ${
              card.isMatched ? 'border-mc-green' : 'border-gray-300'
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
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-yellow-50"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-2xl">🥚</span>
              </div>
              {/* Forside */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-yellow-50 p-1"
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
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-pixel text-mc-green text-xs text-center"
        >
          ALLE PAR FUNNET! 🎉
        </motion.p>
      )}
    </div>
  );
}
