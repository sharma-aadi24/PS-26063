// src/pages/ArticleDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchById } from '../services/api';
import type { Article } from '../types';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [simplified, setSimplified] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchById<Article>('articles', id).then(setArticle).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-[#e0f7ff]/50">Loading…</div>;
  if (!article) return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-red-400">Article not found.</div>;

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff]">
      {/* Hero */}
      <div className="py-16 px-6 bg-gradient-to-br from-[#041024] to-[#0d1a3a]">
        <div className="max-w-3xl mx-auto">
          <Link to="/learn" className="text-[#00d1ff] text-sm hover:underline mb-6 inline-block">← Back to Learn</Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/30 rounded-full px-3 py-1">{article.category}</span>
            <span className="text-xs bg-white/10 text-white/60 rounded-full px-3 py-1">{article.region}</span>
            <span className="text-xs text-white/40 ml-auto py-1">{article.readingTime} min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{article.title}</h1>
          <p className="text-xl text-[#e0f7ff]/80 italic border-l-4 border-[#00d1ff] pl-4 py-1">{article.summary}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setSimplified(!simplified)}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${simplified ? 'bg-[#00d1ff] text-[#0a0e27]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            <span className="text-lg">{simplified ? '🧒' : '🎓'}</span>
            {simplified ? 'Student Mode: ON' : 'Explain for a Student'}
          </button>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-[#e0f7ff]/90 leading-relaxed font-serif">
          {simplified ? (
            <div className="bg-[#00d1ff]/5 border border-[#00d1ff]/20 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">The Simple Explanation</h2>
              <p>Imagine you have a giant freezer that has been collecting dust for thousands of years. By looking at the layers of dust, you could tell what happened in your house long ago. {article.title} is a lot like that!</p>
              <p>Scientists travel to very cold places like {article.region} to study this. It helps us understand our planet better and how it's changing.</p>
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <strong>Cool Fact:</strong> This is a demo simplified version of the content generated for educational purposes.
              </div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/><br/>') }} />
          )}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-2">
          {article.tags.map(t => (
            <span key={t} className="bg-white/5 text-white/50 border border-white/10 rounded-lg px-3 py-1 text-sm">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
