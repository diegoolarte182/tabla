import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, HelpCircle, GraduationCap, ChevronRight, Check } from "lucide-react";
import { OnboardingState } from "../types";

interface OnboardingQuizProps {
  onComplete: (onboardingData: OnboardingState) => void;
}

export default function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [purpose, setPurpose] = useState<string[]>([]);
  const [experience, setExperience] = useState<"Beginner" | "Intermediate" | "Advanced" | "">("");

  const subjectsOptions = [
    "English", "Science", "Math", "Languages", 
    "Technology", "Arts", "Social Studies", 
    "Elementary Education", "Higher Education","Other"
  ];

  const purposeOptions = [
    "Presentations", "Assessment", "Gamification", 
    "Collaboration", "Virtual Classes", "AI Tools", 
    "Interactive Activities", "Content Creation"
  ];

  const experienceOptions = [
    { value: "Beginner", desc: "I'm looking for friendly, simple tools with quick setups." },
    { value: "Intermediate", desc: "I feel good using EdTech and want to design custom lessons." },
    { value: "Advanced", desc: "I love coding, LMS integrations, and advanced configurations." }
  ];

  const handleToggleSubject = (sub: string) => {
    if (subjects.includes(sub)) {
      setSubjects(subjects.filter((s) => s !== sub));
    } else {
      setSubjects([...subjects, sub]);
    }
  };

  const handleTogglePurpose = (purp: string) => {
    if (purpose.includes(purp)) {
      setPurpose(purpose.filter((p) => p !== purp));
    } else {
      setPurpose([...purpose, purp]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (!experience) return;
      onComplete({
        completed: true,
        subjects,
        purpose,
        experience,
      });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressPercent = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-teal-500/35">
      {/* Decorative ambient background rings */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden relative" id="onboarding-card">
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
        
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
              <span className="font-sans font-semibold tracking-wider uppercase text-xs text-slate-400">
                AI Matchmaker
              </span>
            </div>
            <span className="text-slate-400 text-sm font-mono font-medium">
              Step {step} of 3
            </span>
          </div>

          {/* Progress Tracker Slider */}
          <div className="w-full h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
              initial={{ width: "33.3%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question Areas */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-emerald-400" />
                    What do you teach?
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Select your focus areas. We will prioritize tools that fit your schedule.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {subjectsOptions.map((sub) => {
                    const selected = subjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        id={`subject-${sub.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleToggleSubject(sub)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ${
                          selected
                            ? "bg-emerald-500/10 border-emerald-500/60 text-emerald-300"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        <span>{sub}</span>
                        {selected && (
                          <div className="bg-emerald-500 text-slate-950 p-0.5 rounded-full">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-teal-400" />
                    What do you use digital tools for the most?
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Help us customize the periodic suggestions to your primary classroom workflows.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {purposeOptions.map((purp) => {
                    const selected = purpose.includes(purp);
                    return (
                      <button
                        key={purp}
                        id={`purpose-${purp.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleTogglePurpose(purp)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ${
                          selected
                            ? "bg-teal-500/10 border-teal-500/60 text-teal-300"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        <span>{purp}</span>
                        {selected && (
                          <div className="bg-teal-500 text-slate-950 p-0.5 rounded-full">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-blue-400" />
                    How experienced are you with tech?
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    We will find resources matching your comfort level.
                  </p>
                </div>

                <div className="space-y-3">
                  {experienceOptions.map((opt) => {
                    const selected = experience === opt.value;
                    return (
                      <button
                        key={opt.value}
                        id={`exp-${opt.value.toLowerCase()}`}
                        onClick={() => setExperience(opt.value as any)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-4 ${
                          selected
                            ? "bg-blue-500/10 border-blue-500/65 text-blue-300 shadow-sm shadow-blue-500/5"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-base">{opt.value}</div>
                          <div className="text-xs text-slate-400 mt-1">{opt.desc}</div>
                        </div>
                        {selected && (
                          <div className="bg-blue-500 text-slate-950 p-1 rounded-full shrink-0">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800/50">
            <button
              id="back-btn"
              onClick={handlePrev}
              disabled={step === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                step === 1
                  ? "text-slate-600 cursor-not-allowed"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Back
            </button>
            <button
              id="next-btn"
              onClick={handleNext}
              disabled={step === 3 && !experience}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
                step === 3 && !experience
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/10"
              }`}
            >
              <span>{step === 3 ? "Generate Ecosystem" : "Next Step"}</span>
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
