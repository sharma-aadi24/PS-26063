import { useEffect } from 'react';
import { X, MapPin, User, Camera } from 'lucide-react';
import type { MediaItem } from './MediaCard';

interface MediaModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

function isVideo(item: MediaItem): boolean {
  const t = item.type.toLowerCase();
  return t === 'video';
}

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export default function MediaModal({ item, onClose }: MediaModalProps) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!item) return null;

  const video = isVideo(item);
  const fallbackImg = `https://picsum.photos/seed/${item.id}/1200/700`;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Modal content */}
      <div
        className="relative z-10 bg-[#0d1233] border border-[#00d1ff]/20 rounded-2xl overflow-hidden
                   w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(0,209,255,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 border border-white/20
                     flex items-center justify-center text-[#e0f7ff] hover:bg-[#00d1ff]/20 hover:border-[#00d1ff]/40
                     transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Media area */}
        <div className="relative bg-black aspect-video overflow-hidden flex-shrink-0">
          {video && item.url ? (
            <iframe
              src={getEmbedUrl(item.url)}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={item.title}
            />
          ) : (
            <img
              src={item.thumbnail || fallbackImg}
              alt={item.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackImg;
              }}
            />
          )}
        </div>

        {/* Info area */}
        <div className="p-5 overflow-y-auto">
          {/* Type badge + title */}
          <div className="mb-3">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border mr-2 ${
                video
                  ? 'bg-red-900/30 text-red-300 border-red-500/30'
                  : 'bg-blue-900/30 text-blue-300 border-blue-500/30'
              }`}
            >
              {video ? '🎥 Video' : '📷 Photo'}
            </span>
          </div>

          <h2 className="text-[#e0f7ff] font-bold text-lg leading-snug mb-3">{item.title}</h2>

          {item.description && (
            <p className="text-[#a0c8d8] text-sm leading-relaxed mb-4">{item.description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-xs text-[#7a9ab0]">
            {item.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-[#00d1ff]" />
                {item.location}
              </span>
            )}
            {item.photographer && (
              <span className="flex items-center gap-1.5">
                {video ? (
                  <User size={12} className="text-[#00d1ff]" />
                ) : (
                  <Camera size={12} className="text-[#00d1ff]" />
                )}
                {item.photographer}
              </span>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
