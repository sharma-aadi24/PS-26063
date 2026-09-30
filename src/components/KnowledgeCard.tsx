import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

interface KnowledgeCardProps {
  id: string;
  title: string;
  category?: string;
  region?: string;
  summary?: string;
  readingTime?: string | number;
  tags?: string[];
}

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  Glaciology: { icon: '🧊', color: 'text-blue-300', bg: 'bg-blue-900/20' },
  Oceanography: { icon: '🌊', color: 'text-teal-300', bg: 'bg-teal-900/20' },
  Climatology: { icon: '🌡️', color: 'text-orange-300', bg: 'bg-orange-900/20' },
  Biology: { icon: '🐧', color: 'text-green-300', bg: 'bg-green-900/20' },
  Geology: { icon: '🪨', color: 'text-yellow-300', bg: 'bg-yellow-900/20' },
  Meteorology: { icon: '🌨️', color: 'text-purple-300', bg: 'bg-purple-900/20' },
  History: { icon: '📜', color: 'text-amber-300', bg: 'bg-amber-900/20' },
  Technology: { icon: '🛰️', color: 'text-cyan-300', bg: 'bg-cyan-900/20' },
  'Remote Sensing': { icon: '📡', color: 'text-indigo-300', bg: 'bg-indigo-900/20' },
  Policy: { icon: '📋', color: 'text-pink-300', bg: 'bg-pink-900/20' },
};

function getCategoryMeta(category?: string) {
  if (!category) return { icon: '📚', color: 'text-gray-300', bg: 'bg-gray-800/30' };
  return CATEGORY_META[category] ?? { icon: '📚', color: 'text-gray-300', bg: 'bg-gray-800/30' };
}

export default function KnowledgeCard({
  id,
  title,
  category,
  region,
  summary,
  readingTime,
  tags = [],
}: KnowledgeCardProps) {
  const { icon, color, bg } = getCategoryMeta(category);

  return (
    <div
      className="group bg-[#0d1233] border border-white/10 rounded-2xl p-5 flex flex-col gap-3
                 hover:border-[#00d1ff]/30 hover:shadow-[0_0_24px_rgba(0,209,255,0.10)] transition-all duration-300"
    >
      {/* Category */}
      <div className="flex items-center justify-between gap-2">
        {category && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/10 ${bg} ${color}`}>
            <span>{icon}</span>
            {category}
          </span>
        )}
        {readingTime && (
          <span className="flex items-center gap-1 text-xs text-[#7a9ab0] ml-auto">
            <Clock size={11} />
            {typeof readingTime === 'number' ? `${readingTime} min read` : readingTime}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[#e0f7ff] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#00d1ff] transition-colors">
        {title}
      </h3>

      {/* Region */}
      {region && (
        <p className="text-xs text-[#7a9ab0]">📍 {region}</p>
      )}

      {/* Summary */}
      {summary && (
        <p className="text-[#7a9ab0] text-xs leading-relaxed line-clamp-3">{summary}</p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#a0c8d8] border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-3 border-t border-white/5">
        <Link
          to={`/learn/${id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-[#00d1ff] hover:text-white transition-colors group/link"
        >
          Read More
          <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
