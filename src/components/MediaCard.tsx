import { useState } from 'react';
import MediaModal from './MediaModal';

export interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'Photo' | 'Video' | string;
  title: string;
  url?: string;
  thumbnail?: string;
  description?: string;
  tags?: string[];
  location?: string;
  photographer?: string;
  credit?: string;
}

interface MediaCardProps {
  id: string;
  type: string;
  title: string;
  url?: string;
  thumbnail?: string;
  description?: string;
  tags?: string[];
  location?: string;
  photographer?: string;
  credit?: string;
}

function typeLabel(type: string): string {
  const t = type.toLowerCase();
  if (t === 'video') return '🎥 Video';
  if (t === 'photo') return '📷 Photo';
  return `🖼 ${type}`;
}

function typeBadgeColor(type: string): string {
  const t = type.toLowerCase();
  if (t === 'video') return 'bg-red-900/30 text-red-300 border-red-500/30';
  if (t === 'photo') return 'bg-blue-900/30 text-blue-300 border-blue-500/30';
  return 'bg-gray-800/40 text-gray-300 border-gray-500/30';
}

export default function MediaCard({
  id,
  type,
  title,
  url,
  thumbnail,
  description,
  tags = [],
  location,
  photographer,
  credit,
}: MediaCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const fallbackImg = `https://picsum.photos/seed/${id}/400/250`;
  const imgSrc = thumbnail || fallbackImg;

  const item: MediaItem = {
    id,
    type,
    title,
    url,
    thumbnail,
    description,
    tags,
    location,
    photographer: photographer ?? credit,
  };

  return (
    <>
      <div
        className="group bg-[#0d1233] border border-white/10 rounded-2xl overflow-hidden cursor-pointer
                   hover:border-[#00d1ff]/30 hover:shadow-[0_0_28px_rgba(0,209,255,0.12)] transition-all duration-300 flex flex-col"
        onClick={() => setModalOpen(true)}
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video bg-[#060914]">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackImg;
            }}
          />
          {/* Type badge overlay */}
          <div className="absolute top-2 left-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${typeBadgeColor(type)}`}
            >
              {typeLabel(type)}
            </span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#00d1ff]/0 group-hover:bg-[#00d1ff]/05 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white text-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-200">
              {type.toLowerCase() === 'video' ? '▶' : '🔍'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-[#e0f7ff] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#00d1ff] transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-[#7a9ab0] text-xs leading-relaxed line-clamp-2">{description}</p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/20"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#7a9ab0]">
                  +{tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {modalOpen && <MediaModal item={item} onClose={() => setModalOpen(false)} />}
    </>
  );
}
