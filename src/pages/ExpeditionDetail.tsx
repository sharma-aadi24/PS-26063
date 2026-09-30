// src/pages/ExpeditionDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchById, fetchEntity } from '../services/api';
import type { Expedition, Dataset, Publication, MediaItem } from '../types';

const TABS = ['Overview', 'Media', 'Datasets', 'Publications'] as const;
type Tab = typeof TABS[number];

const toSVG = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 600,
  y: ((90 - lat) / 180) * 300,
});

const ExpeditionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exp, setExp]       = useState<Expedition | null>(null);
  const [datasets, setDatasets]     = useState<Dataset[]>([]);
  const [pubs, setPubs]     = useState<Publication[]>([]);
  const [media, setMedia]   = useState<MediaItem[]>([]);
  const [tab, setTab]       = useState<Tab>('Overview');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchById<Expedition>('expeditions', id),
      fetchEntity<Dataset>('datasets'),
      fetchEntity<Publication>('publications'),
      fetchEntity<MediaItem>('media'),
    ]).then(([e, ds, ps, ms]) => {
      setExp(e);
      setDatasets(ds.filter(d => e.datasetIds.includes(d.id)));
      setPubs(ps.filter(p => e.publicationIds.includes(p.id)));
      setMedia(ms.filter(m => e.mediaIds.includes(m.id)));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-[#e0f7ff]/50">Loading…</div>;
  if (!exp)    return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-red-400">Expedition not found.</div>;

  const routePoints = exp.routePoints.map(p => toSVG(p.lat, p.lng));

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff]">
      {/* Hero */}
      <div className="relative py-16 px-6 bg-gradient-to-br from-[#041024] to-[#0d1a3a]">
        <div className="max-w-5xl mx-auto">
          <Link to="/expeditions" className="text-[#00d1ff] text-sm hover:underline mb-4 inline-block">
            ← All Expeditions
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-blue-900/50 text-blue-300 border border-blue-700 rounded-full px-3 py-0.5">{exp.region}</span>
            <span className="text-xs bg-white/10 text-white/60 rounded-full px-3 py-0.5 font-mono">{exp.year}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">{exp.title}</h1>
          <p className="text-[#e0f7ff]/70 max-w-2xl">{exp.summary}</p>
          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            <div><span className="text-white/40">Duration</span><br /><span className="text-white font-medium">{exp.duration}</span></div>
            <div><span className="text-white/40">Vessel</span><br /><span className="text-white font-medium">{exp.vessel}</span></div>
            <div><span className="text-white/40">Team Size</span><br /><span className="text-white font-medium">{exp.team.length} scientists</span></div>
            <div><span className="text-white/40">Datasets</span><br /><span className="text-white font-medium">{exp.datasetIds.length}</span></div>
            <div><span className="text-white/40">Publications</span><br /><span className="text-white font-medium">{exp.publicationIds.length}</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 bg-[#0a0e27]/95 border-b border-white/10 z-10">
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${tab === t ? 'border-[#00d1ff] text-[#00d1ff]' : 'border-transparent text-white/50 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === 'Overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Objectives */}
            <div className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-white mb-3">Research Objectives</h3>
              <ul className="space-y-2">
                {exp.objectives.map((o, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#e0f7ff]/80">
                    <span className="text-[#00d1ff] mt-0.5">▹</span> {o}
                  </li>
                ))}
              </ul>
            </div>

            {/* Team */}
            <div className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-white mb-3">Research Team</h3>
              <div className="space-y-1">
                {exp.team.map((member, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#e0f7ff]/80">
                    <span className="w-7 h-7 rounded-full bg-[#00d1ff]/20 flex items-center justify-center text-xs text-[#00d1ff] font-bold">
                      {member.split(' ').pop()?.charAt(0)}
                    </span>
                    {member}
                  </div>
                ))}
              </div>
            </div>

            {/* Route Map */}
            <div className="md:col-span-2 bg-[#041024] border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-white mb-3">Expedition Route</h3>
              <svg viewBox="0 0 600 300" className="w-full rounded-lg bg-[#030d1e]">
                <rect width="600" height="300" fill="#030d1e" />
                {[1,2].map(i => <line key={i} x1={0} y1={i*100} x2={600} y2={i*100} stroke="#ffffff08" />)}
                {[1,2,3,4,5].map(i => <line key={i} x1={i*100} y1={0} x2={i*100} y2={300} stroke="#ffffff08" />)}
                <line x1={0} y1={150} x2={600} y2={150} stroke="#00d1ff22" strokeWidth="1" strokeDasharray="4" />

                {/* Route line */}
                {routePoints.length > 1 && (
                  <polyline
                    points={routePoints.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none" stroke="#00d1ff" strokeWidth="2" strokeDasharray="6,3"
                  />
                )}
                {/* Waypoints */}
                {routePoints.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={6} fill={i === routePoints.length - 1 ? '#00d1ff' : '#ffffff'} />
                    <text x={p.x + 8} y={p.y + 4} fill="#e0f7ff" fontSize="9" fontFamily="monospace">
                      {exp.routePoints[i].label}
                    </text>
                  </g>
                ))}
              </svg>
              <p className="text-xs text-white/30 mt-2">[DEMO] Simplified route map — approximate positions.</p>
            </div>
          </div>
        )}

        {tab === 'Media' && (
          <div>
            <h3 className="font-bold text-white mb-4">Expedition Media ({media.length} items)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {media.map(m => (
                <div key={m.id} onClick={() => setLightbox(m)}
                  className="group relative rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-[#00d1ff]/50 transition aspect-video bg-[#0d1a3a]">
                  <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <span className="text-xs bg-[#00d1ff]/80 text-[#0a0e27] px-2 py-0.5 rounded-full self-start mb-1">
                      {m.type === 'video' ? '🎥 Video' : '📷 Photo'}
                    </span>
                    <span className="text-white text-xs font-semibold line-clamp-1">{m.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Datasets' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white mb-4">Related Datasets ({datasets.length})</h3>
            {datasets.map(d => (
              <Link key={d.id} to={`/datasets/${d.id}`}
                className="block bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-5 hover:border-[#00d1ff]/40 transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono bg-emerald-900/50 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded">{d.format}</span>
                  <span className="text-xs text-white/40">{d.size} · {d.year}</span>
                </div>
                <h4 className="font-bold text-white mb-1">{d.title}</h4>
                <p className="text-sm text-[#e0f7ff]/60 line-clamp-2">{d.description}</p>
                <span className="text-xs text-[#00d1ff] mt-2 block">View Dataset →</span>
              </Link>
            ))}
          </div>
        )}

        {tab === 'Publications' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white mb-4">Related Publications ({pubs.length})</h3>
            {pubs.map(p => (
              <div key={p.id} className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-5">
                <h4 className="font-bold text-white mb-1">{p.title}</h4>
                <p className="text-xs text-[#e0f7ff]/50 mb-2">{p.authors.join(', ')} · <em>{p.journal}</em> · {p.year}</p>
                <p className="text-sm text-[#e0f7ff]/70 mb-2 line-clamp-3">{p.abstract}</p>
                <span className="text-xs font-mono text-[#00d1ff]">DOI: {p.doi}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="max-w-3xl w-full bg-[#0d1a3a] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {lightbox.type === 'video'
              ? <iframe src={lightbox.url} className="w-full aspect-video" allowFullScreen title={lightbox.title} />
              : <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-96 object-cover" />
            }
            <div className="p-5">
              <h3 className="font-bold text-white text-lg">{lightbox.title}</h3>
              <p className="text-sm text-[#e0f7ff]/60 mt-1">{lightbox.description}</p>
              <div className="text-xs text-white/30 mt-2">📍 {lightbox.location} · 📷 {lightbox.photographer}</div>
            </div>
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpeditionDetail;
