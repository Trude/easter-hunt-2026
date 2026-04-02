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
    locked: 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed',
    active: 'bg-yellow-100 border-yellow-400 cursor-pointer hover:border-yellow-500 shadow-md shadow-yellow-200',
    completed: 'bg-purple-50 border-purple-300 cursor-pointer hover:border-purple-400',
    secret: 'bg-purple-100 border-purple-500 cursor-pointer hover:border-purple-600',
  };

  const badgeStyles: Record<CardStatus, string> = {
    locked: 'text-gray-400',
    active: 'text-yellow-600',
    completed: 'text-purple-500',
    secret: 'text-purple-600',
  };

  const card = (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all select-none ${cardStyles[status]}`}
    >
      <span className="text-2xl">
        {status === 'locked' ? '🔒' : status === 'completed' ? '✅' : status === 'secret' ? '🔍' : icon}
      </span>
      <span className="font-pixel text-xs text-center leading-tight text-gray-800">
        {status === 'secret' ? 'HEMMELIG' : title}
      </span>
      {status !== 'locked' && (
        <span className={`font-pixel text-xs ${badgeStyles[status]}`}>#{id}</span>
      )}
    </div>
  );

  if (status === 'active') {
    return (
      <motion.div
        animate={{ boxShadow: ['0 0 0px #facc15', '0 0 16px #facc15', '0 0 0px #facc15'] }}
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
