import React from 'react';
import { motion } from 'motion/react';

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 -z-55 overflow-hidden pointer-events-none">
      {/* Deep backing canvas */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#0a0518] transition-colors duration-500" />

      {/* Floating Blob 1 - Top Left (Purple/Indigo) */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/20 dark:bg-purple-900/15 blur-[120px]"
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, 80, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Blob 2 - Center Right (Cyan/Blue) */}
      <motion.div
        className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-cyan-500/15 dark:bg-cyan-800/10 blur-[100px]"
        animate={{
          x: [0, -80, 40, 0],
          y: [0, -60, 50, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Blob 3 - Bottom Left (Pink/Rose) */}
      <motion.div
        className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-pink-500/10 dark:bg-rose-950/10 blur-[130px]"
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -80, 30, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Futuristic Grid Overlays */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] transition-opacity duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(147, 51, 234) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(147, 51, 234) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
