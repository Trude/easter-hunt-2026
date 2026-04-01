import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { storage } from '../lib/storage';
import type { Player } from '../lib/storage';

interface GameContextType {
  isDeptComplete: (player: Player, dept: number) => boolean;
  completeDept: (player: Player, dept: number) => void;
  isEggFound: (player: Player, eggId: string) => boolean;
  foundEgg: (player: Player, eggId: string) => void;
  countEggsFound: (player: Player, total: number) => number;
  allEggsFound: (player: Player, total: number) => boolean;
  isSecretUnlocked: (player: Player) => boolean;
  refresh: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

const CHEAT_SEQUENCE = 'cheatcode';

export function GameProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0);
  const [cheatBanner, setCheatBanner] = useState(false);
  const refresh = useCallback(() => setTick(t => t + 1), []);
  const bufferRef = useRef('');

  // Global cheat code listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-CHEAT_SEQUENCE.length);
      if (bufferRef.current === CHEAT_SEQUENCE) {
        storage.activateCheat();
        storage.markCheatActive();
        bufferRef.current = '';
        setCheatBanner(true);
        refresh();
        setTimeout(() => setCheatBanner(false), 3000);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [refresh]);

  const completeDept = useCallback((player: Player, dept: number) => {
    storage.setDeptComplete(player, dept);
    // Sjekk easter eggs etter fullføring
    refresh();
  }, [refresh]);

  const foundEgg = useCallback((player: Player, eggId: string) => {
    storage.markEggFound(player, eggId);
    refresh();
  }, [refresh]);

  return (
    <GameContext.Provider value={{
      isDeptComplete: (p, d) => { void tick; return storage.isDeptComplete(p, d); },
      completeDept,
      isEggFound: (p, id) => { void tick; return storage.isEggFound(p, id); },
      foundEgg,
      countEggsFound: (p, total) => { void tick; return storage.countEggsFound(p, total); },
      allEggsFound: (p, total) => { void tick; return storage.allEggsFound(p, total); },
      isSecretUnlocked: (p) => { void tick; return storage.isSecretUnlocked(p); },
      refresh,
    }}>
      {cheatBanner && (
        <div className="fixed top-4 left-4 right-4 z-[9999] bg-purple-900 border-2 border-purple-400 rounded-lg p-4 text-center shadow-2xl animate-pulse">
          <p className="font-pixel text-purple-200 text-xs tracking-widest">🔓 CHEAT ACTIVATED 🔓</p>
          <p className="font-pixel text-purple-400 text-xs mt-1">Alt er låst opp!</p>
        </div>
      )}
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
