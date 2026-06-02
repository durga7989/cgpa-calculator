import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, HelpCircle, Calculator, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

const GRADES = [
  { grade: 'S', points: 10, label: 'S (Outstanding - 10)' },
  { grade: 'A', points: 9, label: 'A (Excellent - 9)' },
  { grade: 'B', points: 8, label: 'B (Very Good - 8)' },
  { grade: 'C', points: 7, label: 'C (Good - 7)' },
  { grade: 'D', points: 6, label: 'D (Average - 6)' }
];

export default function SubjectForm({ 
  totalCredits, 
  subjects, 
  setSubjects, 
  onCalculate, 
  onBack, 
  onReset 
}) {
  
  // Calculate total currently entered credits
  const enteredCredits = subjects.reduce((sum, s) => sum + (parseInt(s.credits, 10) || 0), 0);
  const remainingCredits = totalCredits - enteredCredits;
  const isCorrectWeight = enteredCredits === totalCredits;
  const isExceeded = enteredCredits > totalCredits;

  const handleAddSubject = () => {
    // Determine default name number based on length
    const nextNum = subjects.length + 1;
    const newSubject = { 
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5), 
      name: `Subject ${nextNum}`, 
      credits: 3, 
      grade: 'A' 
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleRemoveSubject = (id) => {
    // Keep at least 1 row for UX
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleUpdate = (id, field, value) => {
    setSubjects(
      subjects.map(s => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  const handleCalculateClick = () => {
    // Validate empty subject names
    const hasEmptyNames = subjects.some(s => !s.name.trim());
    if (hasEmptyNames) {
      alert('Please fill in names for all subjects.');
      return;
    }

    if (!isCorrectWeight) {
      return;
    }

    onCalculate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="relative">
        {/* Glow behind container */}
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-500 opacity-10 dark:opacity-20 blur-2xl pointer-events-none" />

        <div className="relative overflow-visible rounded-3xl border border-white/40 dark:border-purple-900/30 bg-white/70 dark:bg-[#11082d]/75 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-purple-950/40 mb-6">
            <div className="flex items-center space-x-3">
              <button
                id="back-step-btn"
                onClick={onBack}
                className="p-2 rounded-xl border border-gray-200/50 dark:border-purple-800/20 bg-gray-50/50 dark:bg-purple-950/20 text-gray-600 dark:text-purple-300 hover:text-purple-600 dark:hover:text-cyan-400 hover:border-purple-500/40 hover:bg-white dark:hover:bg-purple-900/10 transition-all cursor-pointer"
                title="Go back to credit entry"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-display font-semibold text-xl text-gray-900 dark:text-white flex items-center gap-1.5">
                  Subject & Syllabus Matrix
                </h2>
                <p className="text-xs text-gray-500 dark:text-purple-300/60 mt-0.5">
                  Define your subject roster and academic grades to run calculations.
                </p>
              </div>
            </div>

            {/* Quick Reset Controller */}
            <button
              id="reset-form-btn"
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono tracking-wide border border-rose-200/50 dark:border-rose-950/40 bg-rose-50/30 dark:bg-rose-950/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-900/60 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Applet
            </button>
          </div>

          {/* Core Analytics Tracker Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Target Weight Card */}
            <div className="px-4 py-3.5 rounded-2xl bg-gray-50/30 dark:bg-purple-950/10 border border-gray-100 dark:border-purple-950/20">
              <span className="block text-[10px] font-mono uppercase text-gray-400 dark:text-purple-400/60">Target Semester Index</span>
              <span className="text-lg font-semibold font-display text-gray-800 dark:text-purple-100 mt-1 block">
                {totalCredits} <span className="text-xs font-normal font-sans text-gray-500 dark:text-purple-400">Total Credits</span>
              </span>
            </div>

            {/* Current Enrolled Weight Card */}
            <div className={`px-4 py-3.5 rounded-2xl bg-gray-50/30 dark:bg-purple-950/10 border transition-all duration-300 ${isCorrectWeight ? 'border-emerald-500/40 dark:border-emerald-500/20 bg-emerald-500/5' : isExceeded ? 'border-rose-500/40 dark:border-rose-500/20 bg-rose-500/5' : 'border-purple-500/20'}`}>
              <span className="block text-[10px] font-mono uppercase text-gray-400 dark:text-purple-400/60">Allocated Credits</span>
              <span className={`text-lg font-semibold font-display mt-1 block ${isCorrectWeight ? 'text-emerald-600 dark:text-emerald-400' : isExceeded ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-purple-600 dark:text-purple-300'}`}>
                {enteredCredits} <span className="text-xs font-normal font-sans text-gray-500 dark:text-purple-400">/ {totalCredits} Credits Entered</span>
              </span>
            </div>

            {/* Allocation Status Alert Area */}
            <div className="md:col-span-1 flex items-center justify-start p-1">
              {isCorrectWeight ? (
                <div id="allocation-matched-alert" className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium font-display p-2 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/10 w-full h-full">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                  <span>Curriculum weights match perfectly!</span>
                </div>
              ) : isExceeded ? (
                <div id="allocation-exceeded-alert" className="flex items-center space-x-2 text-rose-500 dark:text-rose-400 text-xs font-medium font-display p-2 bg-rose-500/5 dark:bg-rose-500/10 rounded-xl border border-rose-500/10 w-full h-full">
                  <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400 animate-bounce flex-shrink-0" />
                  <span>Exceeded target by {enteredCredits - totalCredits} CR.</span>
                </div>
              ) : (
                <div id="allocation-short-alert" className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-medium font-display p-3 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/10 w-full h-full">
                  <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-bounce flex-shrink-0" />
                  <span>Need {remainingCredits} more credits allocation.</span>
                </div>
              )}
            </div>
          </div>

          {/* Subject Rows Form Wrapper */}
          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-2 mb-6">
            <div className="hidden sm:grid grid-cols-12 gap-3 px-3 text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-purple-400/50">
              <div className="col-span-6">Subject Descriptor / Name</div>
              <div className="col-span-3">Credits</div>
              <div className="col-span-2">Grade</div>
              <div className="col-span-1"></div>
            </div>

            <AnimatePresence initial={false}>
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-[#f8fafc]/80 dark:bg-purple-950/15 border border-gray-150 dark:border-purple-900/15 rounded-xl focus-within:border-purple-500/45 focus-within:ring-2 focus-within:ring-purple-500/5 transition-all duration-300"
                >
                  {/* Name Input */}
                  <div className="col-span-1 sm:col-span-6">
                    <span className="sm:hidden block text-[10px] font-mono tracking-wider text-gray-400 dark:text-purple-400/70 mb-1">Subject Name</span>
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => handleUpdate(subject.id, 'name', e.target.value)}
                      placeholder="e.g. Mathematics II"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-purple-950/30 text-sm font-medium border border-gray-200 dark:border-purple-800/15 rounded-lg focus:border-purple-500 focus:outline-none text-gray-800 dark:text-white transition-colors"
                    />
                  </div>

                  {/* Credits Selection */}
                  <div className="col-span-1 sm:col-span-3">
                    <span className="sm:hidden block text-[10px] font-mono tracking-wider text-gray-400 dark:text-purple-400/70 mb-1">Credits</span>
                    <select
                      value={subject.credits}
                      onChange={(e) => handleUpdate(subject.id, 'credits', parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2.5 bg-white dark:bg-[#150d32] text-sm text-gray-800 dark:text-purple-100 border border-gray-200 dark:border-purple-800/15 finished:text-xs rounded-lg focus:border-purple-500 focus:outline-none font-display font-medium cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => (
                        <option key={c} value={c}>
                          {c} {c === 1 ? 'Credit' : 'Credits'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Grade Selection */}
                  <div className="col-span-1 sm:col-span-2">
                    <span className="sm:hidden block text-[10px] font-mono tracking-wider text-gray-400 dark:text-purple-400/70 mb-1">Grade</span>
                    <select
                      value={subject.grade}
                      onChange={(e) => handleUpdate(subject.id, 'grade', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-[#150d32] text-sm text-gray-800 dark:text-purple-100 border border-gray-200 dark:border-purple-800/15 rounded-lg focus:border-purple-500 focus:outline-none font-display font-semibold text-center cursor-pointer"
                    >
                      {GRADES.map((g) => (
                        <option key={g.grade} value={g.grade}>
                          {g.grade} (PT: {g.points})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1 sm:col-span-1 flex items-end sm:items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(subject.id)}
                      disabled={subjects.length <= 1}
                      className="p-2.5 sm:p-2.5 rounded-lg border border-rose-100 dark:border-rose-950/20 text-rose-500 dark:text-rose-400/70 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-950/50 hover:border-transparent disabled:opacity-30 disabled:pointer-events-none transition-all duration-250 cursor-pointer"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add Row Button Area */}
          <div className="flex justify-start mb-8">
            <motion.button
              id="add-subject-row-btn"
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAddSubject}
              className="px-4 py-2.5 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-500/5 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-purple-500"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject Row</span>
            </motion.button>
          </div>

          {/* Large glowing action button */}
          <div className="relative group mt-4">
            <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 opacity-25 group-hover:opacity-60 blur-xl transition duration-500 pointer-events-none ${!isCorrectWeight ? 'opacity-5 group-hover:opacity-5' : ''}`} />
            
            <button
              id="calculate-cgpa-btn"
              type="button"
              disabled={!isCorrectWeight}
              onClick={handleCalculateClick}
              className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-display font-semibold transition-all duration-500 overflow-hidden relative shadow-lg ${isCorrectWeight ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-white shadow-purple-500/10 active:scale-[0.98] cursor-pointer' : 'bg-gray-100 dark:bg-purple-950/20 text-gray-400 dark:text-purple-400/40 border border-gray-200 dark:border-purple-900/30 cursor-not-allowed'}`}
            >
              {isCorrectWeight && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
              
              <Calculator className="w-5 h-5" />
              <span>Calculate Terminal CGPA</span>
            </button>
          </div>

          {/* Under-mismatch warning block */}
          {!isCorrectWeight && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[11px] font-mono text-gray-400 dark:text-purple-400/60 mt-3"
            >
              Configure entered subjects to sum exactly to {totalCredits} Credits to launch calculation.
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
