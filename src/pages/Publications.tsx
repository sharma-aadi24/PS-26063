// src/pages/Publications.tsx
import React, { useEffect, useState } from 'react';
import { fetchEntity } from '../services/api';
import type { Publication } from '../types';

const Publications: React.FC = () => {
  const [all, setAll] = useState<Publication[]>([]);
  const [q, setQ]     = useState('');
  const [year, setYear] = useState('All');
  const [area, setArea] = useState('All');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntity<Publication>('publications').then(setAll).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const years = ['All', ...Array.from(new Set(all.map(p => String(p.year)))).sort().reverse()];
  const areas = ['All', ...Array.from(new Set(all.map(p => p.researchArea)))];

  const filtered = all.filter(p => {
    if (year !== 'All' && String(p.year) !== year) return false;
    if (area !== 'All' && p.researchArea !== area) return false;
    if (q && !p.title.toLowerCase().includes(q.toLowerCase()) && !p.authors.join(' ').toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">📚 Publications</h1>
        <p className="text-[#e0f7ff]/60 mb-6">Peer-reviewed research publications from India's polar programmes. [DEMO DATA]</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title or author…"
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#00d1ff] transition flex-1 min-w-48" />
          <select value={year} onChange={e => setYear(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d1ff]">
            {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
          </select>
          <select value={area} onChange={e => setArea(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d1ff]">
            {areas.map(a => <option key={a} value={a}>{a === 'All' ? 'All Areas' : a}</option>)}
          </select>
          <span className="self-center text-sm text-[#e0f7ff]/50">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#e0f7ff]/50">Loading publications…</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-[#0d1a3a]/80 border border-white/10 rounded-xl p-5 hover:border-white/20 transition">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs bg-purple-900/50 text-purple-300 border border-purple-700 rounded-full px-2 py-0.5">{p.researchArea}</span>
                  <span className="text-xs text-white/40 font-mono">{p.year}</span>
                </div>
                <h3 className="font-bold text-white mb-1">{p.title}</h3>
                <p className="text-sm text-[#e0f7ff]/50 mb-1">
                  {p.authors.slice(0, 3).join(', ')}{p.authors.length > 3 ? ' et al.' : ''} · <em>{p.journal}</em>
                </p>
                <p className="text-xs font-mono text-[#00d1ff]/60 mb-2">DOI: {p.doi}</p>
                <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                  className="text-xs text-white/50 hover:text-white transition">
                  {expanded === p.id ? '▲ Hide abstract' : '▼ Show abstract'}
                </button>
                {expanded === p.id && (
                  <p className="text-sm text-[#e0f7ff]/70 mt-3 leading-relaxed border-t border-white/10 pt-3">{p.abstract}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;
