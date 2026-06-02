import React from 'react';
import { Sun, Moon, GraduationCap, Sparkles } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/60 dark:bg-[#0d0720]/60 border-b border-gray-200/50 dark:border-purple-900/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 opacity-75 blur-md group-hover:opacity-100 transition duration-300 pointer-events-none" />
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 text-white dark:bg-purple-950 dark:text-cyan-400 border border-purple-500/20">
                <GraduationCap className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-purple-800 to-cyan-600 dark:from-purple-300 dark:to-cyan-400 bg-clip-text text-transparent">
                AURA GRADER
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-mono tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase">
                v2.0
              </span>
            </div>
          </div>

          {/* Slogan */}
          <div className="hidden md:flex items-center text-xs font-mono text-gray-500 dark:text-purple-400/60 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-yellow-400" />
            Empowering College Scholars
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-4">
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="relative p-2.5 rounded-xl border border-gray-200/50 dark:border-purple-800/25 bg-gray-50/55 dark:bg-purple-950/20 text-gray-700 dark:text-purple-300 hover:text-purple-600 dark:hover:text-cyan-400 hover:border-purple-500/50 hover:bg-white dark:hover:bg-purple-900/10 transition-all duration-300 shadow-sm shadow-purple-500/5 cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                {darkMode ? (
                  <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-45 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
