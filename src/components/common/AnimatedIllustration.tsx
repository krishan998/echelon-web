import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedIllustrationProps {
  className?: string;
  children: React.ReactNode;
}

export function AnimatedIllustration({ className = '', children }: AnimatedIllustrationProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg blur-xl" />
      </motion.div>
    </motion.div>
  );
} 