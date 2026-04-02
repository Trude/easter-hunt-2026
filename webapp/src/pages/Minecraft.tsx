import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../lib/storage';

// Ingredienser
const INGREDIENTS = [
  { id: 'ull', name: 'Hvit ull', emoji: '🐑', owner: 'SELDA' },
  { id: 'pinne', name: 'Pinne', emoji: '🪵', owner: 'SANDER' },
  { id: 'gulrot', name: 'Gulrot', emoji: '🥕', owner: 'SANDER' },
] as const;

type IngredientId = typeof INGREDIENTS[number]['id'];

// Korrekt løsning: ull øverst midten (idx 1), pinne midten (idx 4), gulrot nederst midten (idx 7)
const SOLUTION: Record<number, IngredientId> = {
  1: 'ull',
  4: 'pinne',
  7: 'gulrot',
};

function isSolved(grid: (IngredientId | null)[]): boolean {
  return Object.entries(SOLUTION).every(([idx, id]) => grid[parseInt(idx)] === id) &&
    grid.every((cell, i) => {
      if (SOLUTION[i]) return cell === SOLUTION[i];
      return cell === null;
    });
}

export default function Minecraft() {
  const [grid, setGrid] = useState<(IngredientId | null)[]>(Array(9).fill(null));
  const [selected, setSelected] = useState<IngredientId | null>(null);
  const [solved, setSolved] = useState(storage.isMinecraftDone());
  const [showAchievement, setShowAchievement] = useState(false);

  const handleIngredientClick = useCallback((id: IngredientId) => {
    setSelected(prev => prev === id ? null : id);
  }, []);

  const handleCellClick = useCallback((cellIdx: number) => {
    if (solved) return;
    setGrid(prev => {
      const next = [...prev];
      if (selected === null) {
        // Klikk på celle uten valgt ingrediens → fjern innhold
        next[cellIdx] = null;
      } else if (next[cellIdx] === selected) {
        // Klikk på celle med samme ingrediens → fjern
        next[cellIdx] = null;
      } else {
        // Fjern ingrediensen fra annen celle først
        const existingIdx = next.findIndex(c => c === selected);
        if (existingIdx !== -1) next[existingIdx] = null;
        next[cellIdx] = selected;
      }

      // Sjekk løsning
      if (isSolved(next)) {
        storage.setMinecraftDone();
        setSolved(true);
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
      }
      return next;
    });
    setSelected(null);
  }, [selected, solved]);

  const usedIngredients = new Set(grid.filter(Boolean));

  if (solved) {
    return (
      <div className="min-h-screen px-4 py-8 max-w-lg mx-auto flex flex-col items-center gap-8 text-center">
        <AnimatePresence>
          {showAchievement && (
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-50 border-2 border-mc-yellow rounded px-4 py-3 flex items-center gap-3 shadow-lg"
            >
              <span className="text-2xl">🏆</span>
              <div className="text-left">
                <p className="font-pixel text-mc-yellow text-xs">ACHIEVEMENT UNLOCKED!</p>
                <p className="font-pixel text-gray-700 text-xs mt-0.5">Påskehare-staven laget!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-6xl">🪄</div>
        <h2 className="font-pixel text-mc-yellow text-xs leading-relaxed">
          PÅSKEHARE-STAVEN LAGET!
        </h2>
        <p className="font-pixel text-gray-700 text-xs leading-relaxed max-w-xs">
          Bra craftet, detektiver! Neste spor bæres av en trofast venn med fire poter.
        </p>
        <div className="border border-mc-yellow rounded p-4">
          <p className="font-pixel text-gray-600 text-xs mb-2">OPPDRAGET FORTSETTER FYSISK</p>
          <p className="font-pixel text-gray-700 text-xs leading-relaxed">
            Sjekk Odin — han vet noe!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">MINECRAFT-OPPDRAGET</h1>
        <p className="font-pixel text-gray-600 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
          Lag Påskehare-staven! Dere har ingrediensene — sett dem på riktig plass i craftingbordet.
        </p>
      </div>

      {/* Ingrediensoversikt */}
      <div className="mb-6">
        <p className="font-pixel text-gray-500 text-xs mb-3 text-center">INGREDIENSER</p>
        <div className="grid grid-cols-2 gap-2">
          {/* Sander */}
          <div className="border border-gray-200 rounded p-3">
            <p className="font-pixel text-mc-yellow text-xs mb-2">SANDER har:</p>
            <div className="flex flex-col gap-2">
              {INGREDIENTS.filter(i => i.owner === 'SANDER').map(ing => (
                <button
                  key={ing.id}
                  onClick={() => handleIngredientClick(ing.id)}
                  disabled={usedIngredients.has(ing.id) && grid.includes(ing.id)}
                  className={`flex items-center gap-2 rounded border px-2 py-2 transition-all ${
                    selected === ing.id
                      ? 'border-mc-yellow bg-mc-yellow/20'
                      : usedIngredients.has(ing.id)
                      ? 'border-gray-200 opacity-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-xl">{ing.emoji}</span>
                  <span className="font-pixel text-xs text-gray-700">{ing.name}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Selda */}
          <div className="border border-gray-200 rounded p-3">
            <p className="font-pixel text-mc-yellow text-xs mb-2">SELDA har:</p>
            <div className="flex flex-col gap-2">
              {INGREDIENTS.filter(i => i.owner === 'SELDA').map(ing => (
                <button
                  key={ing.id}
                  onClick={() => handleIngredientClick(ing.id)}
                  disabled={usedIngredients.has(ing.id) && grid.includes(ing.id)}
                  className={`flex items-center gap-2 rounded border px-2 py-2 transition-all ${
                    selected === ing.id
                      ? 'border-mc-yellow bg-mc-yellow/20'
                      : usedIngredients.has(ing.id)
                      ? 'border-gray-200 opacity-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-xl">{ing.emoji}</span>
                  <span className="font-pixel text-xs text-gray-700">{ing.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {selected && (
          <p className="font-pixel text-mc-yellow text-xs text-center mt-2">
            Valgt: {INGREDIENTS.find(i => i.id === selected)?.emoji} — trykk på en rute
          </p>
        )}
      </div>

      {/* Craftingbord */}
      <div className="flex gap-4 items-center justify-center mb-4">
        {/* 3×3 grid */}
        <div className="flex flex-col gap-1">
          <p className="font-pixel text-gray-500 text-xs text-center mb-1">CRAFTINGBORD</p>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }, (_, idx) => {
              const cellContent = grid[idx];
              const ing = cellContent ? INGREDIENTS.find(i => i.id === cellContent) : null;
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  className={`w-16 h-16 border-2 rounded flex items-center justify-center transition-all ${
                    selected
                      ? 'border-mc-yellow/50 bg-mc-yellow/5 hover:bg-mc-yellow/10'
                      : cellContent
                      ? 'border-gray-500 bg-gray-800'
                      : 'border-gray-200 bg-yellow-50'
                  }`}
                >
                  {ing ? (
                    <span className="text-2xl">{ing.emoji}</span>
                  ) : (
                    <span className="text-gray-700 font-pixel text-xs"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pil + Resultat */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-pixel text-gray-500 text-xs">→</span>
          <div className="w-16 h-16 border-2 border-gray-300 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-gray-600 font-pixel text-xs">?</span>
          </div>
        </div>
      </div>

      <p className="font-pixel text-gray-600 text-xs text-center leading-relaxed">
        Tips: Tykk på en ingrediens, så på riktig rute i craftingbordet
      </p>
    </div>
  );
}
