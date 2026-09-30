// src/pages/Expeditions.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEntity } from '../services/api';
import type { Expedition } from '../types';

const REGIONS = ['All', 'Antarctica', 'Arctic', 'Himalayas', 'Southern Ocean'];
const YEARS   = ['All', '2024', '2023', '2022', '2021'];

const REGION_COLORS: Record<string, string> = {
  Antarctica:      'bg-blue-900/50 text-blue-300 border-blue-700',
  Arctic:          'bg-purple-900/50 text-purple-300 border-purple-700',
  Himalayas:       'bg-green-900/50 text-green-300 border-green-700',
  'Southern Ocean':'bg-teal-900/50 text-teal-300 border-teal-700',
};

const Expeditions: React.FC = () => {
  const [all, setAll]       = useState<Expedition[]>([]);
  const [region, setRegion] = useState('All');
  const [year, setYear]     = useState('All');
  const [q, setQ]           = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntity<Expedition>('expeditions').then(d => { setAll(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = all.filter(e => {
    if (region !== 'All' && e.region !== region) return false;
    if (year   !== 'All' && String(e.year) !== year) return false;
    if (q && !e.title.toLowerCase().includes(q.toLowerCase()) && !e.summary.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">🧊 Expeditions</h1>
        <p className="text-[#e0f7ff]/60 mb-6">Complete archive of Indian polar research expeditions.</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search expeditions…"
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#00d1ff] transition w-64" />
          <select value={region} onChange={e => setRegion(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d1ff]">
            {REGIONS.map(r => <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>)}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d1ff]">
            {YEARS.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
          </select>
          <span className="self-center text-sm text-[#e0f7ff]/50">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#e0f7ff]/50">Loading expeditions…</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(exp => (
              <Link key={exp.id} to={`/expeditions/${exp.id}`}
                className="group bg-[#0d1a3a]/80 border border-white/10 rounded-xl overflow-hidden hover:border-[#00d1ff]/50 transition">
                <div className="h-2 bg-gradient-to-r from-[#00d1ff] to-blue-600" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${REGION_COLORS[exp.region] || 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                      {exp.region}
                    </span>
                    <span className="text-xs text-[#e0f7ff]/40 font-mono">{exp.year}</span>
                  </div>
                  <h2 className="text-base font-bold text-white mb-2 group-hover:text-[#00d1ff] transition line-clamp-2">
                    {exp.title}
                  </h2>
                  <p className="text-sm text-[#e0f7ff]/60 mb-3 line-clamp-2">{exp.summary}</p>
                  <div className="text-xs text-[#e0f7ff]/40 mb-3">
                    📅 {exp.duration} &nbsp;·&nbsp; 🚢 {exp.vessel}
                  </div>
                  <div className="text-xs text-[#00d1ff]">View Expedition →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Expeditions;
