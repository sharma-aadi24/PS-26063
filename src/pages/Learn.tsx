// src/pages/Learn.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEntity } from '../services/api';
import type { Article } from '../types';
import QuizComponent from '../components/QuizComponent';
import KnowledgeCard from '../components/KnowledgeCard';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which Indian research station is currently operational in Antarctica?",
    options: ["Dakshin Gangotri", "Himadri", "Bharati", "Sagar Kanya"],
    answer: "Bharati",
    explanation: "Bharati and Maitri are India's currently operational research stations in Antarctica. Dakshin Gangotri was decommissioned, and Himadri is in the Arctic.",
    difficulty: "easy" as const
  },
  {
    id: 2,
    question: "What is the primary function of an ice core?",
    options: ["To measure current temperatures", "To store frozen biological samples", "To reveal past climate history", "To test drilling equipment"],
    answer: "To reveal past climate history",
    explanation: "Ice cores trap tiny bubbles of ancient air and isotopic signatures that scientists use to reconstruct past climate conditions dating back hundreds of thousands of years.",
    difficulty: "medium" as const
  },
  {
    id: 3,
    question: "Where is India's Himadri station located?",
    options: ["South Pole", "Svalbard, Norway", "Himalayas", "Greenland"],
    answer: "Svalbard, Norway",
    explanation: "Himadri is India's first permanent Arctic research station located at Spitsbergen, Svalbard, Norway.",
    difficulty: "easy" as const
  }
];

const Learn: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [missionStep, setMissionStep] = useState(1);

  useEffect(() => {
    fetchEntity<Article>('articles').then(setArticles).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const completeStep = (step: number) => {
    if (missionStep === step) setMissionStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff] p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center py-10">
          <h1 className="text-4xl font-extrabold text-white mb-4">🎓 Polar Academy</h1>
          <p className="text-lg text-[#e0f7ff]/70">Explore, learn, and test your knowledge of polar science.</p>
        </div>

        {/* Knowledge Hub */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">📚 Featured Articles</h2>
          {loading ? (
            <div className="text-[#e0f7ff]/50">Loading articles...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 6).map(article => (
                <KnowledgeCard
                  key={article.id}
                  id={article.id.toString()}
                  title={article.title}
                  category={article.category}
                  region={article.region}
                  summary={article.summary}
                  readingTime={article.readingTime}
                  tags={article.tags}
                />
              ))}
            </div>
          )}
        </section>

        {/* Polar Explorer Mission */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">🚀 Polar Explorer Mission</h2>
          <div className="bg-[#0d1a3a]/80 border border-[#00d1ff]/20 rounded-2xl p-8">
            <p className="text-[#e0f7ff]/80 mb-6">Complete these tasks to earn your Polar Explorer badge.</p>
            
            <div className="space-y-4 relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#00d1ff]/20" />
              
              {[
                { step: 1, title: 'Locate Antarctica', path: '/explore' },
                { step: 2, title: 'Read about Sea Ice', path: '/learn/1' },
                { step: 3, title: 'Visit Maitri Station', path: '/stations/1' },
                { step: 4, title: 'Browse a Dataset', path: '/datasets/1' },
                { step: 5, title: 'Generate an Outreach Post', path: '/outreach' },
              ].map(m => {
                const isActive = missionStep === m.step;
                const isDone = missionStep > m.step;
                return (
                  <div key={m.step} className="relative flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold z-10 transition-colors ${
                      isDone ? 'bg-[#00d1ff] text-[#0a0e27]' : isActive ? 'bg-[#0d1a3a] border-2 border-[#00d1ff] text-[#00d1ff]' : 'bg-[#0d1a3a] border-2 border-white/20 text-white/40'
                    }`}>
                      {isDone ? '✓' : m.step}
                    </div>
                    <div className={`flex-1 p-4 rounded-xl border ${isActive ? 'bg-[#00d1ff]/10 border-[#00d1ff]/50' : 'bg-white/5 border-white/10'} flex justify-between items-center`}>
                      <span className={`font-semibold ${isDone ? 'text-white/60 line-through' : 'text-white'}`}>{m.title}</span>
                      <Link to={m.path} onClick={() => completeStep(m.step)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isDone ? 'bg-white/5 text-white/40' : 'bg-[#00d1ff] text-[#0a0e27] hover:bg-[#00d1ff]/80'}`}>
                        {isDone ? 'Completed' : 'Go →'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {missionStep > 5 && (
              <div className="mt-8 p-6 bg-[#00d1ff]/10 border border-[#00d1ff] rounded-xl text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">Mission Accomplished!</h3>
                <p className="text-[#00d1ff]">You are now a certified POLARIS Explorer.</p>
              </div>
            )}
          </div>
        </section>

        {/* Interactive Quiz */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">🧠 Knowledge Test</h2>
          <QuizComponent questions={QUIZ_QUESTIONS} />
        </section>

      </div>
    </div>
  );
};

export default Learn;
