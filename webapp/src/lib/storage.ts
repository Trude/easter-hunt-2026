export type Player = 'sander' | 'selda' | 'svein';

const key = (parts: string[]) => parts.join('_');

export const storage = {
  // Avdeling fullført
  setDeptComplete: (player: Player, dept: number) =>
    localStorage.setItem(key([player, 'dept', String(dept), 'complete']), 'true'),
  isDeptComplete: (player: Player, dept: number): boolean =>
    localStorage.getItem(key([player, 'dept', String(dept), 'complete'])) === 'true',

  // Easter eggs
  markEggFound: (player: Player, eggId: string) =>
    localStorage.setItem(key([player, 'egg', eggId]), 'true'),
  isEggFound: (player: Player, eggId: string): boolean =>
    localStorage.getItem(key([player, 'egg', eggId])) === 'true',
  countEggsFound: (player: Player, total: number): number => {
    let count = 0;
    for (let i = 1; i <= total; i++) {
      if (localStorage.getItem(key([player, 'egg', String(i)])) === 'true') count++;
    }
    return count;
  },
  allEggsFound: (player: Player, total: number): boolean =>
    storage.countEggsFound(player, total) >= total,

  // Hemmelig avdeling
  isSecretUnlocked: (player: Player): boolean =>
    localStorage.getItem(key([player, 'secret', 'unlocked'])) === 'true',
  unlockSecret: (player: Player) =>
    localStorage.setItem(key([player, 'secret', 'unlocked']), 'true'),

  // Minispill best score
  setBestScore: (player: Player, game: string, score: number) => {
    const current = storage.getBestScore(player, game);
    if (score > current) localStorage.setItem(key([player, game, 'best']), String(score));
  },
  getBestScore: (player: Player, game: string): number =>
    parseInt(localStorage.getItem(key([player, game, 'best'])) || '0'),

  // Kombiner-koder
  setKombinerCode: (player: Player, code: string) =>
    localStorage.setItem(key([player, 'kombiner', 'code']), code.toUpperCase()),
  getKombinerCode: (player: Player): string =>
    localStorage.getItem(key([player, 'kombiner', 'code'])) || '',

  // Reset (kun for voksne/testing)
  resetAll: () => localStorage.clear(),
};
