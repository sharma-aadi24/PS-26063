// src/pages/DatasetDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchById } from '../services/api';
import type { Dataset } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

// Generate demo chart data seeded by dataset id
const makeChartData = (id: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    value: +(Math.sin((i + id) * 0.8) * 10 + 20 + id * 0.5).toFixed(2),
  }));

const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ds, setDs] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchById<Dataset>('datasets', id).then(setDs).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-[#e0f7ff]/50">Loading…</div>;
  if (!ds)     return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-red-400">Dataset not found.</div>;

  const chartData = makeChartData(ds.id);

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff]">
      {/* Hero */}
      <div className="py-12 px-6 bg-gradient-to-br from-[#041024] to-[#0d1a3a]">
        <div className="max-w-5xl mx-auto">
          <Link to="/datasets" className="text-[#00d1ff] text-sm hover:underline mb-4 inline-block">← All Datasets</Link>
          <div className="flex gap-2 mb-3">
            <span className="text-xs bg-emerald-900/50 text-emerald-300 border border-emerald-700 rounded-full px-3 py-0.5">{ds.format}</span>
            <span className="text-xs bg-white/10 text-white/60 rounded-full px-3 py-0.5">{ds.researchArea}</span>
            <span className="text-xs bg-yellow-900/50 text-yellow-300 border border-yellow-700 rounded-full px-3 py-0.5">DEMO DATASET</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">{ds.title}</h1>
          <p className="text-[#e0f7ff]/70 max-w-2xl">{ds.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Metadata */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Region', value: ds.region },
            { label: 'Year', value: String(ds.year) },
            { label: 'Format', value: ds.format },
            { label: 'Size', value: ds.size },
            { label: 'Institution', value: ds.institution },
            { label: 'License', value: ds.license },
          ].map(item => (
            <div key={item.label} className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-white/40 mb-1">{item.label}</p>
              <p className="font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {/* DOI */}
        <div className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-white/40 mb-1">Digital Object Identifier (DOI)</p>
          <p className="font-mono text-[#00d1ff]">{ds.doi}</p>
        </div>

        {/* Variables */}
        <div className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-5">
          <h3 className="font-bold text-white mb-3">Measured Variables</h3>
          <div className="flex flex-wrap gap-2">
            {ds.variables.map(v => (
              <span key={v} className="bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/30 rounded-full px-3 py-1 text-sm">{v}</span>
            ))}
          </div>
        </div>

        {/* Demo chart */}
        <div className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Data Preview</h3>
            <span className="text-xs text-yellow-400 border border-yellow-400/40 rounded-full px-2 py-0.5">SIMULATED DEMO DATA</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff40" tick={{ fontSize: 11 }} />
              <YAxis stroke="#ffffff40" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0d1a3a', border: '1px solid #00d1ff40', color: '#e0f7ff' }} />
              <Line type="monotone" dataKey="value" stroke="#00d1ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-white/30 mt-2 text-center">
            Synthetic monthly values — for illustration only. Actual data is in {ds.format} format.
          </p>
        </div>

        {/* Download */}
        <div className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white mb-1">Download Dataset</h3>
            <p className="text-sm text-[#e0f7ff]/60">Format: {ds.format} · Size: {ds.size}</p>
          </div>
          <button
            onClick={() => alert('⚠️ This is a demo prototype. Dataset download is not available in the prototype — this would link to the actual NCPOR data portal in production.')}
            className="px-6 py-3 bg-[#00d1ff] text-[#0a0e27] font-bold rounded-xl hover:bg-[#00d1ff]/80 transition">
            📥 Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
