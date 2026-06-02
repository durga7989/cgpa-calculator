import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Calculator, History, Sparkles, BookOpen } from 'lucide-react';

// Components
import Navbar from './components/Navbar.jsx';
import CreditSelector from './components/CreditSelector.jsx';
import SubjectForm from './components/SubjectForm.jsx';
import ResultCard from './components/ResultCard.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import BackgroundEffect from './components/BackgroundEffect.jsx';
import ConfettiCanvas from './components/ConfettiCanvas.jsx';

export default function App() {
  // Theme state - defaults to dark as requested by standard/user prompt
  const [darkMode, setDarkMode] = useState(true);
  
  // Application Stage / Step state: 1 (Credit Setup), 2 (Row inputs), 5 (Results)
  const [step, setStep] = useState(1);
  const [totalCredits, setTotalCredits] = useState('');
  const [subjects, setSubjects] = useState([]);
  
  // History logs loaded from LocalStorage
  const [history, setHistory] = useState([]);
  
  // Active calculation results
  const [calculatedCgpa, setCalculatedCgpa] = useState(0);
  const [totalGradePoints, setTotalGradePoints] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(null);

  // Sync dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load history from LocalStorage on mount
  useEffect(() => {
    const rawHistory = localStorage.getItem('aura_cgpa_history');
    if (rawHistory) {
      try {
        setHistory(JSON.parse(rawHistory));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Helper to generate smart defaults for courses based on total credits
  const generateDefaultSubjects = (totalCr) => {
    let remaining = totalCr;
    const list = [];
    let index = 1;

    while (remaining > 0) {
      // Pick dynamic credit bounds
      let cr = 4;
      if (remaining >= 4) {
        cr = 4;
      } else if (remaining >= 3) {
        cr = 3;
      } else {
        cr = remaining;
      }

      list.push({
        id: 'subj-' + Date.now().toString() + index + Math.random().toString(36).substr(2, 4),
        name: `Subject ${index}`,
        credits: cr,
        grade: 'A' // Excellent - Grade A default
      });

      remaining -= cr;
      index++;
    }
    return list;
  };

  // Step 1 -> Step 2 Transitions
  const handleCreditsEntered = (enteredCredits) => {
    setTotalCredits(enteredCredits);
    // Auto populate subject rows adding up exactly to this total weight
    setSubjects(generateDefaultSubjects(enteredCredits));
    setStep(2);
  };

  // Calculate CGPA score and update indicators
  const handleCalculate = () => {
    const pointsMap = { S: 10, A: 9, B: 8, C: 7, D: 6 };
    
    const sumPoints = subjects.reduce((sum, subj) => {
      const weightPoints = pointsMap[subj.grade] || 0;
      return sum + (subj.credits * weightPoints);
    }, 0);

    const calculatedResult = sumPoints / totalCredits;
    
    setCalculatedCgpa(calculatedResult);
    setTotalGradePoints(sumPoints);
    setIsSaved(false);
    setStep(5);

    // Trigger confetti if high-score (outstanding/excellent grades)
    if (calculatedResult >= 8.0) {
      setConfettiTrigger(Date.now());
    }
  };

  // Save calculated logs directly to history storage
  const handleSaveToHistory = () => {
    if (isSaved) return;

    const newRecord = {
      id: 'record-' + Date.now().toString() + Math.random().toString(36).substr(2, 4),
      date: new Date().toISOString(),
      totalCredits,
      cgpa: calculatedCgpa,
      totalGradePoints,
      subjects: subjects.map(s => ({ name: s.name, credits: s.credits, grade: s.grade }))
    };

    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('aura_cgpa_history', JSON.stringify(updatedHistory));
    setIsSaved(true);
  };

  // Delete individual record from history logs
  const handleDeleteHistoryItem = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('aura_cgpa_history', JSON.stringify(updatedHistory));
  };

  // Clear all history records from LocalStorage
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear your CGPA history logs? This action is permanent.')) {
      setHistory([]);
      localStorage.removeItem('aura_cgpa_history');
    }
  };

  // Loading previous log settings back into applet
  const handleLoadHistoryItem = (record) => {
    setTotalCredits(record.totalCredits);
    setSubjects(record.subjects.map((s, idx) => ({
      id: 'subj-' + Date.now().toString() + idx + Math.random().toString(36).substr(2, 4),
      name: s.name,
      credits: s.credits,
      grade: s.grade
    })));
    setCalculatedCgpa(record.cgpa);
    setTotalGradePoints(record.totalGradePoints);
    setIsSaved(true);
    setStep(2); // Jump to editable matrix structure
  };

  // Global reset for active computations
  const handleFullReset = () => {
    setStep(1);
    setTotalCredits('');
    setSubjects([]);
    setCalculatedCgpa(0);
    setTotalGradePoints(0);
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-gray-900 dark:text-gray-100 selection:bg-purple-500/30 selection:text-white pb-12 transition-colors duration-500">
      
      {/* Background Graphic Blobs & Grid */}
      <BackgroundEffect />

      {/* Confetti canvas emitter overlay */}
      <ConfettiCanvas trigger={confettiTrigger} />

      {/* Futuristic Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Dashboard Panel Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Workstation (Interactive Grader Cards) */}
          <div className="lg:col-span-2 flex flex-col justify-start">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <CreditSelector
                  key="credit-selector"
                  initialCredits={totalCredits}
                  onContinue={handleCreditsEntered}
                />
              )}

              {step === 2 && (
                <SubjectForm
                  key="subject-form"
                  totalCredits={totalCredits}
                  subjects={subjects}
                  setSubjects={setSubjects}
                  onCalculate={handleCalculate}
                  onBack={() => setStep(1)}
                  onReset={handleFullReset}
                />
              )}

              {step === 5 && (
                <ResultCard
                  key="result-card"
                  cgpa={calculatedCgpa}
                  totalCredits={totalCredits}
                  totalGradePoints={totalGradePoints}
                  subjects={subjects}
                  isSaved={isSaved}
                  onSave={handleSaveToHistory}
                  onReset={handleFullReset}
                />
              )}
            </AnimatePresence>
          </div>

          {/* History Log Column */}
          <div className="lg:col-span-1">
            <HistoryPanel
              history={history}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
              onLoadItem={handleLoadHistoryItem}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
