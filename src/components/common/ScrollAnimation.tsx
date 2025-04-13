import React from 'react';
import { motion } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn';
}

export function ScrollAnimation({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  animation = 'fadeIn'
}: ScrollAnimationProps) {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
    },
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      className={className}
      initial={selectedAnimation.initial}
      whileInView={selectedAnimation.whileInView}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
} 