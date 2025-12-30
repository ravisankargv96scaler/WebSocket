import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../constants';
import { Award, Check, X } from 'lucide-react';

export const QuizView: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Knowledge Check</h2>
        <p className="text-slate-400">Test your understanding of WebSockets vs. HTTP.</p>
      </div>

      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
          const hasAnswered = selectedAnswers[q.id] !== undefined;

          return (
            <div key={q.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-slate-200">
                <span className="text-neon-blue mr-2">{idx + 1}.</span>
                {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((opt, optIdx) => {
                  let btnClass = "w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 flex justify-between items-center ";
                  
                  if (showResults) {
                    if (optIdx === q.correctAnswer) {
                      btnClass += "bg-emerald-900/30 border-emerald-500 text-emerald-400";
                    } else if (selectedAnswers[q.id] === optIdx) {
                      btnClass += "bg-red-900/30 border-red-500 text-red-400";
                    } else {
                      btnClass += "border-slate-700 text-slate-500 opacity-50";
                    }
                  } else {
                    if (selectedAnswers[q.id] === optIdx) {
                      btnClass += "bg-neon-blue/10 border-neon-blue text-neon-blue";
                    } else {
                      btnClass += "bg-slate-900 border-slate-700 hover:bg-slate-700 text-slate-300";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={btnClass}
                      disabled={showResults}
                    >
                      <span>{opt}</span>
                      {showResults && optIdx === q.correctAnswer && <Check size={18} />}
                      {showResults && selectedAnswers[q.id] === optIdx && optIdx !== q.correctAnswer && <X size={18} />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-6">
        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
            className="px-8 py-3 bg-neon-purple hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-[0_0_15px_rgba(191,0,255,0.4)] transition-all transform hover:scale-105"
          >
            Submit Answers
          </button>
        ) : (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="inline-block p-4 rounded-full bg-slate-800 border-2 border-neon-green mb-4">
               <Award size={48} className="text-neon-green" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              You scored {calculateScore()} / {QUIZ_QUESTIONS.length}
            </h3>
            <p className="text-slate-400 mb-6">
              {calculateScore() === 3 ? "Perfect! You're a WebSocket Wizard 🧙‍♂️" : "Good effort! Review the sections and try again."}
            </p>
            <button
              onClick={() => { setShowResults(false); setSelectedAnswers({}); }}
              className="text-neon-blue hover:text-white underline"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};