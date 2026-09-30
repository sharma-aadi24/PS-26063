// src/pages/Media.tsx
import React, { useEffect, useState } from 'react';
import { fetchEntity } from '../services/api';
import type { MediaItem } from '../types';

type TabType = 'all' | 'photo' | 'video';

const Media: React.FC = () => {
  const [all, setAll] = useState<MediaItem[]>([]);
  const [tab, setTab] = useState<TabType>('all');
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntity<MediaItem>('media').then(setAll).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? all : all.filter(m => m.type === tab);

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">📷 Media Library</h1>
        <p className="text-[#e0f7ff]/60 mb-6">Photographs and videos from India's polar expeditions. [DEMO — placeholder images]</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'photo', 'video'] as TabType[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${tab === t ? 'bg-[#00d1ff] text-[#0a0e27]' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
              {t === 'all' ? '🌐 All' : t === 'photo' ? '📷 Photos' : '🎥 Videos'}
              <span className="ml-2 text-xs opacity-60">
                {t === 'all' ? all.length : all.filter(m => m.type === t).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#e0f7ff]/50">Loading media…</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map(m => (
              <div key={m.id} onClick={() => setLightbox(m)}
                className="group break-inside-avoid rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-[#00d1ff]/50 transition relative">
                <img src={m.thumbnail} alt={m.title} className="w-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                  <span className="text-xs bg-[#00d1ff]/80 text-[#0a0e27] px-2 py-0.5 rounded-full self-start mb-1">
                    {m.type === 'video' ? '🎥 Video' : '📷 Photo'}
                  </span>
                  <span className="text-white text-sm font-semibold line-clamp-1">{m.title}</span>
                  <span className="text-white/50 text-xs">{m.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="max-w-4xl w-full bg-[#0d1a3a] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {lightbox.type === 'video'
              ? <iframe src={lightbox.url} className="w-full aspect-video" allowFullScreen title={lightbox.title} />
              : <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[60vh] object-cover" />
            }
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-xl mb-1">{lightbox.title}</h3>
                  <p className="text-sm text-[#e0f7ff]/60 mb-3">{lightbox.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-white/40">
                    <span>📍 {lightbox.location}</span>
                    <span>📷 {lightbox.photographer}</span>
                    <span>📅 {lightbox.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {lightbox.tags.map(t => (
                      <span key={t} className="bg-white/10 text-white/60 rounded-full px-2 py-0.5 text-xs">{t}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setLightbox(null)} className="text-white/40 hover:text-white text-2xl ml-4">✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
