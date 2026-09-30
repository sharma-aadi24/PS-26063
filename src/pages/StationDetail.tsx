// src/pages/StationDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchById } from '../services/api';
import type { Station } from '../types';

const HOTSPOTS = [
  { id: 'exterior', label: '🏠 Station Exterior', icon: '🏠', desc: 'The exterior of the station is designed to withstand extreme polar conditions — high winds, blizzards and temperatures as low as −40°C. Insulated walls, reinforced roofing and elevated design prevent snow accumulation. Solar panels and wind turbines supplement diesel generators for power.' },
  { id: 'lab', label: '🔬 Laboratory', icon: '🔬', desc: 'The main scientific laboratory contains instruments for atmospheric sampling, ice core analysis, geophysical measurements and biological research. All samples collected in the field are processed here before shipping to India for detailed analysis.' },
  { id: 'living', label: '🛏 Living Area', icon: '🛏', desc: 'The living quarters accommodate the over-wintering crew of 25 scientists and support staff. Facilities include a dining hall, recreation room, library and communication centre. Mental wellbeing during the long polar winter is carefully supported through structured activities.' },
  { id: 'obs', label: '📡 Observation Deck', icon: '📡', desc: 'The observation deck and instrument platform hosts continuous monitoring equipment — weather stations, Dobson spectrophotometers for ozone measurement, magnetic variometers and GPS receivers for crustal motion detection. Data is transmitted to India daily via satellite.' },
];

const StationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchById<Station>('stations', id).then(setStation).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-[#e0f7ff]/50">Loading…</div>;
  if (!station) return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-red-400">Station not found.</div>;

  const activeHS = HOTSPOTS.find(h => h.id === activeHotspot);

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff]">
      {/* Hero */}
      <div className="relative py-16 px-6 bg-gradient-to-br from-[#041024] to-[#0d1a3a]">
        <div className="max-w-5xl mx-auto">
          <Link to="/stations" className="text-[#00d1ff] text-sm hover:underline mb-4 inline-block">← All Stations</Link>
          <div className="flex gap-2 mb-3">
            <span className="text-xs bg-blue-900/50 text-blue-300 border border-blue-700 rounded-full px-3 py-0.5">{station.region}</span>
            <span className="text-xs bg-white/10 text-white/60 rounded-full px-3 py-0.5 font-mono">Est. {station.established}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">{station.name}</h1>
          <p className="text-[#e0f7ff]/60 mb-2">📍 {station.country}</p>
          <p className="text-sm text-white/40 font-mono">Lat: {station.lat.toFixed(4)}° · Lng: {station.lng.toFixed(4)}°</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Description */}
        <div className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-6">
          <h2 className="font-bold text-white text-xl mb-3">About the Station</h2>
          <p className="text-[#e0f7ff]/80 leading-relaxed">{station.description}</p>
        </div>

        {/* Virtual Tour Hotspots */}
        <div>
          <h2 className="font-bold text-white text-xl mb-4">🏁 Virtual Station Tour</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {HOTSPOTS.map(h => (
              <button key={h.id} onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                className={`p-4 rounded-xl border text-center transition ${activeHotspot === h.id ? 'border-[#00d1ff] bg-[#00d1ff]/10 text-[#00d1ff]' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white'}`}>
                <div className="text-3xl mb-2">{h.icon}</div>
                <div className="text-sm font-medium">{h.label.replace(/^\S+ /, '')}</div>
              </button>
            ))}
          </div>
          {activeHS && (
            <div className="bg-[#0d1a3a]/80 border border-[#00d1ff]/30 rounded-xl p-5 text-[#e0f7ff]/80 leading-relaxed">
              <h3 className="font-bold text-white mb-2">{activeHS.label}</h3>
              <p>{activeHS.desc}</p>
            </div>
          )}
        </div>

        {/* Research Areas */}
        <div className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-6">
          <h2 className="font-bold text-white text-xl mb-3">Research Areas</h2>
          <div className="flex flex-wrap gap-2">
            {station.researchAreas.map(a => (
              <span key={a} className="bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/30 rounded-full px-4 py-1 text-sm">{a}</span>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-6">
          <h2 className="font-bold text-white text-xl mb-3">Facilities</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {station.facilities.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-[#e0f7ff]/80">
                <span className="text-[#00d1ff]">✓</span> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Related Links */}
        <div className="flex gap-4 flex-wrap">
          <Link to="/expeditions" className="px-5 py-2 border border-[#00d1ff] text-[#00d1ff] rounded-lg hover:bg-[#00d1ff]/10 transition text-sm">
            View Related Expeditions →
          </Link>
          <Link to="/datasets" className="px-5 py-2 border border-white/20 text-white/60 rounded-lg hover:border-white/40 transition text-sm">
            Browse Datasets →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StationDetail;
