import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePresence } from '@/hooks/usePresence';

interface ActiveUsersCounterProps {
  roomId: string;
  userId: string;
}

export function ActiveUsersCounter({ roomId, userId }: ActiveUsersCounterProps) {
  const { onlineCount } = usePresence(roomId, userId);

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Users className="w-4 h-4" />
      <span>{onlineCount} online</span>
      <motion.div
        className="w-2 h-2 bg-green-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}
