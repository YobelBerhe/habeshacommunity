import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id?: string;
}

export function AnimatedInput({ label, error, className, id, ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s/g, '-')}` : undefined);
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div className="relative">
      {label && (
        <motion.label
          htmlFor={inputId}
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
          {props.required && <span aria-label="required"> *</span>}
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
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={props.required}
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
          id={errorId}
          role="alert"
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
