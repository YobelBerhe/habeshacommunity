import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
}

export default function AnimatedCounter({ end, duration = 2 }: AnimatedCounterProps) {
  const spring = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0
  });
  
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(end);
  }, [spring, end]);

  return <motion.span>{display}</motion.span>;
}
