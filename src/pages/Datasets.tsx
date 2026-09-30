// src/pages/Datasets.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEntity } from '../services/api';
import type { Dataset } from '../types';

const FORMAT_COLORS: Record<string, string> = {
  CSV:     'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  NetCDF:  'bg-blue-900/50 text-blue-300 border-blue-700',
  HDF5:    'bg-purple-900/50 text-purple-300 border-purple-700',
  GeoTIFF: 'bg-orange-900/50 text-orange-300 border-orange-700',
  MiniSEED:'bg-pink-900/50 text-pink-300 border-pink-700',
};

const Datasets: React.FC = () => {
  const [all, setAll] = useState<Dataset[]>([]);
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('All');
  const [area, setArea]     = useState('All');
  const [fmt, setFmt]       = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntity<Dataset>('datasets').then(setAll).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const regions = ['All', ...Array.from(new Set(all.map(d => d.region)))];
  const areas   = ['All', ...Array.from(new Set(all.map(d => d.researchArea)))];
  const fmts    = ['All', ...Array.from(new Set(all.map(d => d.format)))];

  const filtered = all.filter(d => {
    if (region !== 'All' && d.region !== region) return false;
    if (area   !== 'All' && d.researchArea !== area) return false;
    if (fmt    !== 'All' && d.format !== fmt) return false;
    if (q && !d.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">📊 Scientific Datasets</h1>
        <p className="text-[#e0f7ff]/60 mb-6">Discover and access polar research datasets. [DEMO DATA]</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search datasets…"
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#00d1ff] transition w-56" />
          {([['Region', regions, region, setRegion], ['Area', areas, area, setArea], ['Format', fmts, fmt, setFmt]] as const).map(([label, opts, val, fn]) => (
            <select key={label} value={val} onChange={e => (fn as any)(e.target.value)}
              className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d1ff]">
              {opts.map((o: string) => <option key={o} value={o}>{o === 'All' ? `All ${label}s` : o}</option>)}
            </select>
          ))}
          <span className="self-center text-sm text-[#e0f7ff]/50">{filtered.length} dataset{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#e0f7ff]/50">Loading datasets…</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(d => (
              <Link key={d.id} to={`/datasets/${d.id}`}
                className="group bg-[#0d1a3a]/80 border border-white/10 rounded-xl p-5 hover:border-[#00d1ff]/50 transition">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${FORMAT_COLORS[d.format] || 'bg-gray-800 text-gray-300 border-gray-600'}`}>{d.format}</span>
                  <span className="text-xs text-white/40">{d.size}</span>
                </div>
                <h2 className="font-bold text-white mb-2 group-hover:text-[#00d1ff] transition text-sm line-clamp-2">{d.title}</h2>
                <p className="text-xs text-[#e0f7ff]/60 mb-3 line-clamp-2">{d.description}</p>
                <div className="text-xs text-white/30 mb-1">📍 {d.region} · {d.year}</div>
                <div className="text-xs font-mono text-[#00d1ff]/60">DOI: {d.doi}</div>
                <div className="text-xs text-[#00d1ff] mt-2">View Dataset →</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Datasets;
