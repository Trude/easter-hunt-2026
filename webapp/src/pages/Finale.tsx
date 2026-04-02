import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../lib/storage';

// Sjekk om alle tre har fullført sine løp
function allPlayersReady(): boolean {
  // Sander: alle 12 avdelinger fullført
  for (let i = 1; i <= 12; i++) {
    if (!storage.isDeptComplete('sander', i)) return false;
  }
  // Selda: alle 12 avdelinger fullført
  for (let i = 1; i <= 12; i++) {
    if (!storage.isDeptComplete('selda', i)) return false;
  }
  // Svein: alle 6 grupper fullført
  return storage.isSveinAllDone();
}

function playerStatus() {
  let sander = 0, selda = 0, svein = 0;
  for (let i = 1; i <= 12; i++) {
    if (storage.isDeptComplete('sander', i)) sander++;
    if (storage.isDeptComplete('selda', i)) selda++;
  }
  for (let i = 1; i <= 6; i++) {
    if (storage.isDeptComplete('svein', i)) svein++;
  }
  return { sander, selda, svein };
}

export default function Finale() {
  const [revealed, setRevealed] = useState(false);
  const ready = allPlayersReady();
  const status = playerStatus();

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto flex flex-col items-center gap-8 text-center">

      {/* Venter-status hvis ikke alle er klare */}
      {!ready && (
        <>
          <div className="text-4xl">⏳</div>
          <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
            VENTER PÅ ALLE AGENTER...
          </h1>
          <div className="border border-gray-200 rounded p-4 w-full max-w-sm">
            <p className="font-pixel text-gray-600 text-xs mb-4">STATUS:</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-gray-700">🔍 KODEKNEKKEREN (Sander)</span>
                <span className={`font-pixel text-xs ${status.sander >= 12 ? 'text-mc-green' : 'text-gray-500'}`}>
                  {status.sander >= 12 ? '✅ KLAR' : `${status.sander}/12`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-gray-700">🐾 SPORHUNDEN (Selda)</span>
                <span className={`font-pixel text-xs ${status.selda >= 12 ? 'text-mc-green' : 'text-gray-500'}`}>
                  {status.selda >= 12 ? '✅ KLAR' : `${status.selda}/12`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-gray-700">🍊 AGENT ØRANSEN (Svein)</span>
                <span className={`font-pixel text-xs ${status.svein >= 6 ? 'text-mc-green' : 'text-gray-500'}`}>
                  {status.svein >= 6 ? '✅ KLAR' : `${status.svein}/6`}
                </span>
              </div>
            </div>
          </div>
          <p className="font-pixel text-gray-500 text-xs leading-relaxed max-w-xs">
            Finalen åpnes når alle tre agenter har fullført sine oppdrag.
          </p>
        </>
      )}

      {/* Finale — alle klare */}
      {ready && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-8xl"
          >
            🐇
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="font-pixel text-mc-yellow text-sm leading-relaxed">
              SANDER OG SELDA!
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="border border-mc-yellow rounded p-5 max-w-sm"
          >
            <p className="font-pixel text-gray-700 text-xs leading-relaxed">
              Dere er de beste detektivene jeg noensinne har møtt!
            </p>
            <p className="font-pixel text-gray-700 text-xs leading-relaxed mt-3">
              Dere fant alle sporene mine og reddet påsken!
            </p>
            <p className="font-pixel text-mc-green text-xs leading-relaxed mt-3">
              Skatten er gjemt ute — gå og finn den!
            </p>
          </motion.div>

          <AnimatePresence>
            {!revealed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                onClick={() => setRevealed(true)}
                className="bg-mc-yellow text-black font-pixel text-xs py-4 px-10 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1"
              >
                VIS GJEMMESTEDET →
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="text-5xl">🥚</div>
                <div className="border-4 border-mc-yellow rounded-lg p-6 bg-mc-yellow/10">
                  <p className="font-pixel text-mc-yellow text-2xl tracking-widest">
                    BODEN UTE
                  </p>
                </div>

                <p className="font-pixel text-gray-600 text-xs leading-relaxed max-w-xs mt-2">
                  Med hilsen fra Påskeharen og Piip 🐥🐇
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
