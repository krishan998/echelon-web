import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitBy?: 'word' | 'character';
  stagger?: number;
}

export function AnimatedText({ 
  text, 
  className = '', 
  delay = 0, 
  duration = 0.5,
  splitBy = 'word',
  stagger = 0.1
}: AnimatedTextProps) {
  const words = text.split(' ');
  const characters = text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: stagger,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease: "easeOut",
      },
    },
  };

  if (splitBy === 'character') {
    return (
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block"
            style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

interface GradientTextProps {
  text: string;
  gradient?: string;
  className?: string;
  delay?: number;
}

export function GradientText({ 
  text, 
  gradient = 'from-blue-600 to-purple-600',
  className = '',
  delay = 0
}: GradientTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
    >
      {text}
    </motion.div>
  );
}

interface RevealTextProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function RevealText({ 
  children, 
  direction = 'up', 
  delay = 0,
  className = ''
}: RevealTextProps) {
  const directionMap = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directionMap[direction]
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        x: 0 
      }}
      transition={{ 
        delay, 
        duration: 0.8,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
