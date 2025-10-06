import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function AnimatedInput({ label, error, className, ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      {label && (
        <motion.label
          className={cn(
            "block text-sm font-medium mb-2 transition-colors",
            isFocused ? "text-primary" : "text-foreground",
            error && "text-destructive"
          )}
          animate={{
            x: isFocused ? 2 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <motion.div
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <Input
          {...props}
          className={cn(
            className,
            "transition-all duration-200",
            isFocused && "ring-2 ring-primary ring-offset-2",
            error && "border-destructive"
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
