import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight, AlertCircle } from 'lucide-react';

export default function CreditSelector({ onContinue, initialCredits }) {
  const [credits, setCredits] = useState(initialCredits || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(credits, 10);
    
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid positive number of credits.');
      return;
    }
    if (parsed > 60) {
      setError('That is a high workload! Keep it under 60 credits.');
      return;
    }
    
    setError('');
    onContinue(parsed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Decorative Glow Ring around Card */}
      <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 opacity-20 dark:opacity-30 blur-xl pointer-events-none" />

      {/* Glassmorphic Container Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-purple-805/30 bg-white/70 dark:bg-[#11082d]/70 backdrop-blur-xl shadow-2xl p-6 sm:p-8 transition-all duration-300">
        
        {/* Upper card pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/5 rounded-bl-full pointer-events-none" />
        
        {/* Card Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-2xl text-gray-900 dark:text-white tracking-tight">
              Begin Calculation
            </h2>
            <p className="text-sm text-gray-500 dark:text-purple-300/60 mt-1 max-w-xs">
              Configure your semester's registered academic weight to initiate the grader.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono font-medium text-purple-700 dark:text-purple-400 uppercase tracking-widest">
              Total Semester Credits
            </label>
            <div className="relative group">
              <input
                id="total-credits-input"
                type="number"
                placeholder="e.g. 24"
                min="1"
                max="60"
                value={credits}
                onChange={(e) => {
                  setCredits(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-3.5 bg-gray-50/50 dark:bg-purple-950/30 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-purple-400/30 rounded-xl border border-gray-200 dark:border-purple-800/30 focus:border-purple-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-purple-500/10 dark:focus:ring-cyan-400/10 focus:outline-none transition-all duration-300 font-display text-lg font-medium shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 dark:text-purple-400/50 group-focus-within:text-purple-500 dark:group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                CR
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center space-x-2 text-rose-500 dark:text-rose-400 text-xs mt-1 bg-rose-500/5 dark:bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/10"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 animate-bounce" />
                <span>{error}</span>
              </motion.div>
            )}
          </div>

          {/* Continue button */}
          <motion.button
            id="continue-step-btn"
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium tracking-wide shadow-lg hover:shadow-purple-500/20 shadow-purple-600/10 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative flex items-center justify-center space-x-2">
              <span>Set Curriculum Weight</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
