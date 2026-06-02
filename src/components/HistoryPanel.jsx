import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Trash2, ChevronDown, ChevronUp, Calendar, ArrowUpRight, FolderOpen } from 'lucide-react';

export default function HistoryPanel({ history, onDeleteItem, onClearAll, onLoadItem }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getPerformanceColor = (g) => {
    if (g >= 9.0) return 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20';
    if (g >= 8.0) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    if (g >= 7.0) return 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (g >= 6.0) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="relative w-full">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 opacity-5 dark:opacity-10 blur-xl pointer-events-none" />
      
      <div className="relative rounded-2xl border border-white/40 dark:border-purple-900/15 bg-white/50 dark:bg-[#11082d]/50 backdrop-blur-xl p-5 sm:p-6 shadow-xl">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-purple-950/40 mb-4">
          <div className="flex items-center space-x-2 text-gray-800 dark:text-purple-200">
            <History className="w-4 h-4 text-purple-500" />
            <h3 className="font-display font-semibold text-base">Grading History Logs</h3>
          </div>
          {history.length > 0 && (
            <button
              id="clear-all-history-btn"
              onClick={onClearAll}
              className="text-[10px] font-mono uppercase tracking-wider text-rose-500 dark:text-rose-400 hover:underline cursor-pointer"
            >
              Clear Logs
            </button>
          )}
        </div>

        {/* List Content */}
        {history.length === 0 ? (
          <div className="text-center py-8 px-4 text-gray-400 dark:text-purple-400/40">
            <History className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-purple-400/20 stroke-[1.5]" />
            <p className="text-xs font-mono uppercase tracking-wider">No term logs recorded</p>
            <p className="text-[10px] mt-1 max-w-[200px] mx-auto leading-relaxed">
              Log calculations above to track academic benchmarks over terms.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {history.map((item) => {
                const isExpanded = expandedId === item.id;
                const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border border-gray-200/50 dark:border-purple-950/20 rounded-xl bg-white/40 dark:bg-[#11082d]/20 hover:border-purple-500/20 transition-colors"
                  >
                    {/* Collapsed Header */}
                    <div className="p-3.5 flex items-center justify-between select-none">
                      <div className="flex items-center space-x-3.5">
                        {/* Score display badge */}
                        <div className={`p-2.5 rounded-lg border font-display font-medium text-base leading-none ${getPerformanceColor(item.cgpa)}`}>
                          {item.cgpa.toFixed(2)}
                        </div>

                        {/* General details */}
                        <div className="space-y-0.5">
                          <span className="block text-xs font-semibold text-gray-800 dark:text-purple-100 font-display">
                            CGPA Benchmark
                          </span>
                          <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400 dark:text-purple-400/50">
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-3 h-3" />
                              {formattedDate}
                            </span>
                            <span>•</span>
                            <span>{item.totalCredits} Credits</span>
                          </div>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex items-center space-x-2">
                        {/* Expand Trigger */}
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="p-1.5 rounded-lg text-gray-400 dark:text-purple-400 hover:bg-slate-100 dark:hover:bg-purple-900/20 cursor-pointer transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {/* Restore Trigger */}
                        <button
                          onClick={() => onLoadItem(item)}
                          className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-slate-100 dark:hover:bg-purple-900/20 cursor-pointer transition-colors"
                          title="Restore Curriculum to Applet"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Trigger */}
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 rounded-lg text-rose-500/60 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-purple-900/20 cursor-pointer transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-3.5 border-t border-gray-150 dark:border-purple-950/30 bg-gray-50/20 dark:bg-purple-950/5"
                        >
                          <div className="pt-3.5 space-y-2">
                            <span className="block text-[10px] font-mono uppercase text-gray-400 dark:text-purple-400/40 mb-1">
                              Subject Matrix Structure
                            </span>
                            
                            <div className="space-y-1.5">
                              {item.subjects.map((subj, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs p-1.5 rounded bg-white/40 dark:bg-[#150d32]/20 border border-gray-100 dark:border-purple-950/10">
                                  <span className="font-medium text-gray-700 dark:text-purple-200">{subj.name}</span>
                                  <div className="flex items-center space-x-2 text-gray-500 dark:text-purple-400/60 font-mono text-[10px]">
                                    <span>{subj.credits} Credits</span>
                                    <span>•</span>
                                    <span className="font-bold font-sans text-purple-600 dark:text-cyan-400">{subj.grade}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
