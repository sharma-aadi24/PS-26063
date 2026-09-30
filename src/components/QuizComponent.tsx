import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizComponentProps {
  questions: QuizQuestion[];
}

const DIFFICULTY_STYLE = {
  easy: 'bg-green-900/30 text-green-300 border-green-500/40',
  medium: 'bg-yellow-900/30 text-yellow-300 border-yellow-500/40',
  hard: 'bg-red-900/30 text-red-300 border-red-500/40',
};

function scoreMessage(score: number, total: number): { label: string; msg: string; emoji: string } {
  const pct = score / total;
  if (pct >= 0.85) return { label: 'Polar Scientist 🔬', msg: 'Outstanding! You have expert-level polar knowledge.', emoji: '🏆' };
  if (pct >= 0.60) return { label: 'Arctic Explorer 🧭', msg: 'Great work! You know your polar science well.', emoji: '🌟' };
  if (pct >= 0.40) return { label: 'Field Observer 🔭', msg: 'Good effort! Keep exploring to deepen your knowledge.', emoji: '🌊' };
  return { label: 'Curious Beginner 🐧', msg: 'Keep learning! The polar world has much to discover.', emoji: '🧊' };
}

export default function QuizComponent({ questions }: QuizComponentProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const current = questions[currentIdx];

  const handleSelect = (option: string) => {
    if (selected !== null) return; // already answered
    setSelected(option);
    setShowExplanation(true);
    if (option === current.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12 text-[#7a9ab0]">No questions available.</div>
    );
  }

  // Finished screen
  if (finished) {
    const result = scoreMessage(score, total);
    return (
      <div className="bg-[#0d1233] border border-[#00d1ff]/20 rounded-2xl p-8 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">{result.emoji}</div>
        <h2 className="text-[#e0f7ff] font-bold text-2xl mb-1">{result.label}</h2>
        <p className="text-[#7a9ab0] text-sm mb-6">{result.msg}</p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <Trophy size={20} className="text-[#00d1ff]" />
          <span className="text-[#00d1ff] text-4xl font-bold">{score}</span>
          <span className="text-[#7a9ab0] text-xl">/ {total}</span>
        </div>

        {/* Score bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-[#00d1ff] to-[#0090cc] rounded-full transition-all duration-700"
            style={{ width: `${(score / total) * 100}%` }}
          />
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl bg-[#00d1ff]/10 border border-[#00d1ff]/30
                     text-[#00d1ff] font-semibold hover:bg-[#00d1ff]/20 transition-colors"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  const progress = ((currentIdx) / total) * 100;

  return (
    <div className="bg-[#0d1233] border border-white/10 rounded-2xl overflow-hidden max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="h-1.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#00d1ff] to-[#0090cc] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs text-[#7a9ab0]">
            Question {currentIdx + 1} of {total}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                DIFFICULTY_STYLE[current.difficulty] ?? DIFFICULTY_STYLE.easy
              }`}
            >
              {current.difficulty}
            </span>
            <span className="text-xs text-[#00d1ff] font-mono">Score: {score}</span>
          </div>
        </div>

        {/* Question */}
        <h3 className="text-[#e0f7ff] font-semibold text-base leading-snug mb-5">
          {current.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-5">
          {current.options.map((option) => {
            let optStyle =
              'bg-[#060914] border-white/10 text-[#a0c8d8] hover:border-[#00d1ff]/40 hover:bg-[#00d1ff]/05 cursor-pointer';

            if (selected !== null) {
              if (option === current.answer) {
                optStyle = 'bg-green-900/30 border-green-500/60 text-green-200 cursor-default';
              } else if (option === selected && option !== current.answer) {
                optStyle = 'bg-red-900/30 border-red-500/60 text-red-200 cursor-default';
              } else {
                optStyle = 'bg-[#060914] border-white/10 text-[#7a9ab0] cursor-default opacity-60';
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 flex items-center justify-between gap-3 ${optStyle}`}
              >
                <span>{option}</span>
                {selected !== null && option === current.answer && (
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                )}
                {selected !== null && option === selected && option !== current.answer && (
                  <XCircle size={16} className="text-red-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-[#060914] border border-[#00d1ff]/20 rounded-xl p-4 mb-5 animate-[fadeIn_0.3s_ease]">
            <p className="text-xs text-[#00d1ff] font-semibold mb-1 uppercase tracking-wider">
              Explanation
            </p>
            <p className="text-[#a0c8d8] text-sm leading-relaxed">{current.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {selected !== null && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00d1ff] text-[#0a0e27] font-bold text-sm
                         hover:bg-[#33daff] transition-colors"
            >
              {currentIdx + 1 >= total ? 'See Results' : 'Next'}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
