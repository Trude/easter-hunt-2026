import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  show: boolean;
  title: string;
  description?: string;
  onDone: () => void;
}

export default function AchievementPopup({ show, title, description, onDone }: Props) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onDone, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 left-4 right-4 z-50 bg-yellow-50 border-2 border-mc-yellow rounded-lg p-4 flex items-center gap-3 shadow-2xl"
        >
          <div className="text-3xl">🏆</div>
          <div className="flex-1 min-w-0">
            <p className="font-pixel text-mc-yellow text-xs truncate">ACHIEVEMENT UNLOCKED</p>
            <p className="font-pixel text-gray-700 text-xs mt-1 leading-tight">{title}</p>
            {description && (
              <p className="font-pixel text-gray-600 text-xs mt-1 leading-tight truncate">{description}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
