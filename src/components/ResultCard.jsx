import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, RefreshCw, Download, Save, CheckCircle, Flame, Star, BookOpen, Target } from 'lucide-react';
import jsPDF from 'jspdf';

const PERFORMANCE_LEVELS = [
  { range: [9.0, 10.0], title: 'Outstanding', color: 'text-purple-600 dark:text-purple-400', badgeClass: 'bg-purple-100 dark:bg-purple-950/50 border-purple-500/30' },
  { range: [8.0, 8.99], title: 'Excellent', color: 'text-indigo-600 dark:text-indigo-400', badgeClass: 'bg-indigo-100 dark:bg-indigo-950/50 border-indigo-500/30' },
  { range: [7.0, 7.99], title: 'Very Good', color: 'text-cyan-600 dark:text-cyan-400', badgeClass: 'bg-cyan-100 dark:bg-cyan-950/50 border-cyan-500/30' },
  { range: [6.0, 6.99], title: 'Good', color: 'text-emerald-500 dark:text-emerald-400', badgeClass: 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-500/30' },
  { range: [0.0, 5.99], title: 'Needs Improvement', color: 'text-rose-500 dark:text-rose-400', badgeClass: 'bg-rose-100 dark:bg-rose-955/55 border-rose-500/30' }
];

export default function ResultCard({ cgpa, totalCredits, totalGradePoints, subjects, onReset, isSaved, onSave }) {
  const [displayCgpa, setDisplayCgpa] = useState(0);
  const [displayGradePoints, setDisplayGradePoints] = useState(0);

  // Performance calculation
  const perf = PERFORMANCE_LEVELS.find(lvl => cgpa >= lvl.range[0] && cgpa <= lvl.range[1]) || PERFORMANCE_LEVELS[4];

  // Number Counter Animations
  useEffect(() => {
    // Reset counters
    setDisplayCgpa(0);
    setDisplayGradePoints(0);

    const duration = 1500; // ms
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth ease-out-quad formula
      const easeProgress = progress * (2 - progress);

      const nextCgpa = (cgpa * easeProgress).toFixed(2);
      const nextGP = Math.round(totalGradePoints * easeProgress);

      setDisplayCgpa(parseFloat(nextCgpa));
      setDisplayGradePoints(nextGP);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayCgpa(cgpa);
        setDisplayGradePoints(totalGradePoints);
      }
    };

    requestAnimationFrame(animate);
  }, [cgpa, totalGradePoints]);

  // Circular progress ring setup
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Progress value is from 0.0 to 10.0 (percentage is cgpa / 10)
  const progressRatio = displayCgpa / 10;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Download PDF Report with jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Gradient accent banners
    doc.setFillColor(15, 7, 32); // Dark primary indigo
    doc.rect(0, 0, 210, 42, 'F');
    
    // Header styling
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AURA SCHOLAR GRADE REPORT", 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(168, 85, 247); // Purple accent text
    doc.text("EST. COLLEGE PORTAL REPLICA", 20, 26);
    
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.setTextColor(200, 200, 200);
    doc.text(`Generated: ${dateStr}`, 130, 26);

    // Score Dashboard cards
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(248, 250, 252); // Soft gray backing
    doc.roundedRect(20, 52, 170, 42, 3, 3, 'FD');

    // Title inside card
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("ACADEMIC BENCHMARK METRICS", 30, 62);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Semester CGPA Score:`, 30, 72);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(139, 92, 246); // Purple
    doc.text(`${cgpa.toFixed(2)} / 10.0`, 30, 80);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Academic Standing:`, 110, 72);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`${perf.title}`, 110, 80);

    // Info specs
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Total Weight: ${totalCredits} Credits`, 30, 88);
    doc.text(`Formulated Grade Points: ${totalGradePoints}`, 110, 88);

    // Draw Divider Line
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 102, 190, 102);

    // Subject Table Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("CURRICULUM MODULE STRUCTURE", 20, 112);

    // Table head
    doc.setFillColor(240, 243, 248);
    doc.rect(20, 118, 170, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("SUBJECT NAME", 24, 123);
    doc.text("CREDITS", 100, 123);
    doc.text("GRADE", 135, 123);
    doc.text("POINTS", 165, 123);

    // Table rows
    let startY = 126;
    doc.setFont("helvetica", "normal");
    subjects.forEach((subj, i) => {
      // Alternating row background
      if (i % 2 === 1) {
        doc.setFillColor(250, 252, 255);
        doc.rect(20, startY, 170, 7, 'F');
      }
      doc.setTextColor(50, 50, 50);
      doc.text(subj.name, 24, startY + 5);
      doc.text(`${subj.credits} CR`, 100, startY + 5);
      doc.text(subj.grade, 135, startY + 5);
      
      // Determine points
      const ptMap = { S: 10, A: 9, B: 8, C: 7, D: 6 };
      const pts = ptMap[subj.grade] || 0;
      doc.text(`${pts * subj.credits}`, 165, startY + 5);

      startY += 7;
    });

    // Verification seal at bottom
    doc.setDrawColor(240, 240, 240);
    doc.line(20, 240, 190, 240);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This document represents an unofficial digital formulation derived and processed in accordance with college academic requirements.", 20, 248, { maxWidth: 160 });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 7, 32);
    doc.text("Aura Grader Verification Seal", 140, 260);

    // Trigger download
    doc.save(`AURA_CGPA_Report_${cgpa.toFixed(2)}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="relative">
        {/* Glow backdrop based on grade level */}
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-600 dark:to-cyan-400 opacity-20 dark:opacity-35 blur-3xl pointer-events-none" />

        <div className="relative overflow-hidden rounded-3xl border border-white/50 dark:border-purple-900/30 bg-white/70 dark:bg-[#11082d]/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500" />

          {/* Title Area */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <span className="text-xs font-mono tracking-widest text-purple-600 dark:text-cyan-400 uppercase font-semibold">Evaluation Terminus</span>
            <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Academic Results</h2>
          </div>

          {/* Circular Rings Counter Core */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-gray-100 dark:stroke-purple-950/40 fill-none"
                  strokeWidth={strokeWidth}
                />
                {/* Active Progress Ring */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-purple-600 dark:stroke-cyan-400 fill-none"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>

              {/* Central Text Panel */}
              <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                <Star className="w-5 h-5 text-yellow-400 mb-0.5 animate-bounce" />
                <span className="font-display font-extrabold text-4xl text-gray-950 dark:text-white tracking-tighter">
                  {displayCgpa.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-gray-400 dark:text-purple-400 uppercase mt-0.5">CGPA SCORE</span>
              </div>
            </div>

            {/* Performance status badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`mt-6 px-4 py-1.5 rounded-full border flex items-center space-x-1.5 ${perf.badgeClass}`}
            >
              <Award className="w-4 h-4 text-purple-500 dark:text-cyan-400" />
              <span className={`text-sm font-semibold tracking-wide ${perf.color}`}>{perf.title}</span>
            </motion.div>
          </div>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="px-4 py-3 rounded-2xl bg-gray-50/50 dark:bg-purple-950/20 border border-gray-150 dark:border-purple-950/30 text-center">
              <BookOpen className="w-4 h-4 mx-auto mb-1 text-purple-500/80" />
              <span className="block text-[10px] font-mono uppercase text-gray-400 dark:text-purple-400/50">Total Credits</span>
              <span className="text-lg font-bold font-display text-gray-800 dark:text-purple-100">{totalCredits}</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-gray-50/50 dark:bg-purple-950/20 border border-gray-150 dark:border-purple-950/30 text-center">
              <Target className="w-4 h-4 mx-auto mb-1 text-cyan-500/80" />
              <span className="block text-[10px] font-mono uppercase text-gray-400 dark:text-purple-400/50">Grade Points</span>
              <span className="text-lg font-bold font-display text-gray-800 dark:text-purple-100">{displayGradePoints}</span>
            </div>
          </div>

          {/* Primary Operations Footer */}
          <div className="space-y-3">
            {/* Download PDF & Sync calculations */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="download-pdf-btn"
                onClick={handleDownloadPDF}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-purple-800/30 bg-white dark:bg-purple-950/10 hover:bg-slate-50 dark:hover:bg-purple-900/10 text-gray-800 dark:text-purple-200 font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm hover:border-purple-500"
              >
                <Download className="w-4 h-4" />
                <span>Save PDF</span>
              </button>

              <button
                id="save-local-btn"
                onClick={onSave}
                disabled={isSaved}
                className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer border ${isSaved ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 cursor-default shadow-none' : 'border-purple-600/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:border-purple-500 shadow-sm'}`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Saved to History</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Log Result</span>
                  </>
                )}
              </button>
            </div>

            {/* Recalculate button */}
            <button
              id="recalculate-btn"
              onClick={onReset}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-[0.98] transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Calculate New Term</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
