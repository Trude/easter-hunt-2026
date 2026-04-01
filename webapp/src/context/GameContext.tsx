import { createContext, useContext, useState, useCallback } from 'react';
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

export function GameProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick(t => t + 1), []);

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
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
