// src/pages/Explore.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEntity } from '../services/api';
import type { Station } from '../types';

const REGION_COLOR: Record<string, string> = {
  Antarctica: 'bg-blue-900/60 border-blue-500',
  Arctic: 'bg-purple-900/60 border-purple-500',
  'Southern Ocean': 'bg-teal-900/60 border-teal-500',
  Himalayas: 'bg-green-900/60 border-green-500',
};

// SVG world outline placeholder coords (simplified for SVG mapping)
// Convert lat/lng to SVG x/y in a 800×400 equirectangular projection
const toSVG = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 800,
  y: ((90 - lat) / 180) * 400,
});

const Explore: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selected, setSelected] = useState<Station | null>(null);
  const [layers, setLayers] = useState({ stations: true, routes: true });

  useEffect(() => {
    fetchEntity<Station>('stations').then(setStations).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff]">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">🌍 Polar World Explorer</h1>
          <p className="text-[#e0f7ff]/60">Click a station on the map or in the list to explore.</p>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Map area */}
          <div className="flex-1">
            {/* Layer toggles */}
            <div className="flex gap-3 mb-3">
              {Object.entries(layers).map(([key, val]) => (
                <button key={key}
                  onClick={() => setLayers(l => ({ ...l, [key]: !l[key] }))}
                  className={`px-3 py-1 rounded-full text-sm border transition ${val ? 'border-[#00d1ff] text-[#00d1ff] bg-[#00d1ff]/10' : 'border-white/20 text-white/40'}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>

            {/* SVG Map */}
            <div className="bg-[#041024] border border-white/10 rounded-2xl overflow-hidden" style={{ height: 420 }}>
              <svg viewBox="0 0 800 400" className="w-full h-full">
                {/* Simple world grid */}
                <rect width="800" height="400" fill="#041024" />
                {[0, 1, 2, 3].map(i => (
                  <line key={i} x1={0} y1={i * 100} x2={800} y2={i * 100} stroke="#ffffff08" />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                  <line key={i} x1={i * 100} y1={0} x2={i * 100} y2={400} stroke="#ffffff08" />
                ))}
                {/* Equator */}
                <line x1={0} y1={200} x2={800} y2={200} stroke="#00d1ff22" strokeWidth="1" strokeDasharray="4" />
                {/* Polar circles */}
                <line x1={0} y1={100} x2={800} y2={100} stroke="#00d1ff15" strokeWidth="1" strokeDasharray="2" />
                <line x1={0} y1={300} x2={800} y2={300} stroke="#00d1ff15" strokeWidth="1" strokeDasharray="2" />

                {/* Station markers */}
                {layers.stations && stations.map(st => {
                  const { x, y } = toSVG(st.lat, st.lng);
                  const isSelected = selected?.id === st.id;
                  return (
                    <g key={st.id} onClick={() => setSelected(st)} className="cursor-pointer">
                      <circle cx={x} cy={y} r={isSelected ? 14 : 10} fill="#00d1ff22" stroke="#00d1ff" strokeWidth={isSelected ? 2 : 1} className="animate-pulse" />
                      <circle cx={x} cy={y} r={5} fill="#00d1ff" />
                      <text x={x + 12} y={y + 4} fill="#e0f7ff" fontSize="10" fontFamily="monospace">{st.name}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-xs text-white/30 mt-2 text-center">
              Simplified equirectangular map — station positions are approximate. [DEMO]
            </p>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 flex flex-col gap-3">
            {/* Station list */}
            <div className="bg-[#0d1a3a]/80 border border-white/10 rounded-xl p-4">
              <h3 className="font-bold text-white mb-3">Research Stations</h3>
              <div className="space-y-2">
                {stations.map(st => (
                  <button key={st.id} onClick={() => setSelected(st)}
                    className={`w-full text-left p-3 rounded-lg border transition ${selected?.id === st.id ? 'border-[#00d1ff] bg-[#00d1ff]/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                    <div className="font-semibold text-white text-sm">{st.name}</div>
                    <div className="text-xs text-[#e0f7ff]/50">{st.region} · Est. {st.established}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info panel */}
            {selected && (
              <div className={`border rounded-xl p-4 ${REGION_COLOR[selected.region] || 'bg-[#0d1a3a]/80 border-white/10'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-lg">{selected.name}</h3>
                  <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">✕</button>
                </div>
                <p className="text-xs text-[#e0f7ff]/60 mb-2">{selected.country}</p>
                <p className="text-sm text-[#e0f7ff]/80 mb-3 line-clamp-3">{selected.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {selected.researchAreas.slice(0, 4).map(a => (
                    <span key={a} className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{a}</span>
                  ))}
                </div>
                <Link to={`/stations/${selected.id}`}
                  className="block text-center bg-[#00d1ff] text-[#0a0e27] font-bold py-2 rounded-lg text-sm hover:bg-[#00d1ff]/80 transition">
                  Explore Station →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {Object.entries(REGION_COLOR).map(([region]) => (
            <div key={region} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${region === 'Antarctica' ? 'bg-blue-400' : region === 'Arctic' ? 'bg-purple-400' : region === 'Southern Ocean' ? 'bg-teal-400' : 'bg-green-400'}`} />
              <span className="text-[#e0f7ff]/60">{region}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
