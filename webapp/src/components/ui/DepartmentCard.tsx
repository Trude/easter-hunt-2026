import { motion } from 'framer-motion';

type CardStatus = 'locked' | 'active' | 'completed' | 'secret';

interface Props {
  id: number;
  title: string;
  icon: string;
  status: CardStatus;
  onClick: () => void;
}

export default function DepartmentCard({ id, title, icon, status, onClick }: Props) {
  const isClickable = status === 'active' || status === 'completed' || status === 'secret';

  const cardStyles: Record<CardStatus, string> = {
    locked: 'bg-gray-900 border-gray-700 opacity-50 cursor-not-allowed',
    active: 'bg-mc-dark border-mc-yellow cursor-pointer hover:border-yellow-400',
    completed: 'bg-mc-dark border-mc-green cursor-pointer hover:border-green-400',
    secret: 'bg-mc-dark border-purple-500 cursor-pointer hover:border-purple-400',
  };

  const card = (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all select-none ${cardStyles[status]}`}
    >
      <span className="text-2xl">
        {status === 'locked' ? '🔒' : status === 'completed' ? '✅' : status === 'secret' ? '🔍' : icon}
      </span>
      <span className="font-pixel text-xs text-center leading-tight text-white">
        {status === 'secret' ? 'HEMMELIG' : title}
      </span>
      {status !== 'locked' && (
        <span className="font-pixel text-xs text-gray-500">#{id}</span>
      )}
    </div>
  );

  if (status === 'active') {
    return (
      <motion.div
        animate={{ boxShadow: ['0 0 0px #f5c518', '0 0 12px #f5c518', '0 0 0px #f5c518'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="rounded-lg"
      >
        {card}
      </motion.div>
    );
  }

  if (status === 'secret') {
    return (
      <motion.div
        animate={{ boxShadow: ['0 0 0px #a855f7', '0 0 16px #a855f7', '0 0 0px #a855f7'] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="rounded-lg"
      >
        {card}
      </motion.div>
    );
  }

  return card;
}
