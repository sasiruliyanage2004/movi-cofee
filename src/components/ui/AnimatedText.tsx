"use client";

import React from "react";
import { motion } from "framer-motion";

export interface AnimatedTextProps {
  text: string;
  type?: "words" | "lines" | "fade";
  className?: string;
  delay?: number;
  duration?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  type = "words",
  className = "",
  delay = 0,
  duration = 0.6,
}) => {
  if (type === "fade") {
    return (
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`inline-block ${className}`}
      >
        {text}
      </motion.span>
    );
  }

  // Word-by-word reveal
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (customDelay: number) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: customDelay,
      },
    }),
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.28em] gap-y-1 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      custom={delay}
    >
      {words.map((word, idx) => (
        <motion.span key={idx} variants={wordVariants} className="inline-block">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};
