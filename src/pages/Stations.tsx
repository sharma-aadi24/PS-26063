// src/pages/Stations.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEntity } from '../services/api';
import type { Station } from '../types';

const REGION_STYLES: Record<string, { badge: string; border: string }> = {
  Antarctica:      { badge: 'bg-blue-900/50 text-blue-300 border-blue-700', border: 'hover:border-blue-500' },
  Arctic:          { badge: 'bg-purple-900/50 text-purple-300 border-purple-700', border: 'hover:border-purple-500' },
  'Southern Ocean':{ badge: 'bg-teal-900/50 text-teal-300 border-teal-700', border: 'hover:border-teal-500' },
  Himalayas:       { badge: 'bg-green-900/50 text-green-300 border-green-700', border: 'hover:border-green-500' },
};

const Stations: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntity<Station>('stations').then(setStations).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">🏔️ Research Stations</h1>
        <p className="text-[#e0f7ff]/60 mb-8">India's polar research infrastructure across Antarctica, Arctic and the Southern Ocean.</p>
        {loading ? (
          <div className="text-center py-20 text-[#e0f7ff]/50">Loading stations…</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map(st => {
              const styles = REGION_STYLES[st.region] || REGION_STYLES['Antarctica'];
              return (
                <Link key={st.id} to={`/stations/${st.id}`}
                  className={`group bg-[#0d1a3a]/80 border border-white/10 rounded-2xl overflow-hidden transition ${styles.border}`}>
                  <div className="h-40 bg-gradient-to-br from-[#041024] to-[#0d1a3a] flex items-center justify-center">
                    <span className="text-6xl opacity-30">
                      {st.region === 'Antarctica' ? '❄️' : st.region === 'Arctic' ? '🏔' : st.region === 'Southern Ocean' ? '🌊' : '⛰'}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.badge}`}>{st.region}</span>
                      <span className="text-xs text-white/30">Est. {st.established}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1 group-hover:text-[#00d1ff] transition">{st.name}</h2>
                    <p className="text-xs text-white/40 mb-2">📍 {st.country}</p>
                    <p className="text-sm text-[#e0f7ff]/70 line-clamp-2 mb-3">{st.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {st.researchAreas.slice(0, 3).map(a => (
                        <span key={a} className="text-xs bg-white/10 text-white/60 rounded-full px-2 py-0.5">{a}</span>
                      ))}
                      {st.researchAreas.length > 3 && (
                        <span className="text-xs text-white/30">+{st.researchAreas.length - 3}</span>
                      )}
                    </div>
                    <span className="text-xs text-[#00d1ff]">Explore Station →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stations;
