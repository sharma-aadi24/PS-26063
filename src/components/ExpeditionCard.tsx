import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

interface ExpeditionCardProps {
  id: string;
  title: string;
  year: number | string;
  region: string;
  duration?: string;
  summary?: string;
  status?: string;
}

const REGION_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Antarctica: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    border: 'border-blue-500/40',
  },
  Arctic: {
    bg: 'bg-purple-900/30',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
  },
  Himalayas: {
    bg: 'bg-green-900/30',
    text: 'text-green-300',
    border: 'border-green-500/40',
  },
  'Southern Ocean': {
    bg: 'bg-teal-900/30',
    text: 'text-teal-300',
    border: 'border-teal-500/40',
  },
  Alpine: {
    bg: 'bg-indigo-900/30',
    text: 'text-indigo-300',
    border: 'border-indigo-500/40',
  },
};

function getRegionStyle(region: string) {
  const key = Object.keys(REGION_STYLES).find((k) =>
    region.toLowerCase().includes(k.toLowerCase())
  );
  return key
    ? REGION_STYLES[key]
    : { bg: 'bg-gray-800/40', text: 'text-gray-300', border: 'border-gray-500/40' };
}

export default function ExpeditionCard({
  id,
  title,
  year,
  region,
  duration,
  summary,
  status,
}: ExpeditionCardProps) {
  const regionStyle = getRegionStyle(region);

  return (
    <div
      className="group relative bg-[#0d1233] border border-white/10 rounded-2xl overflow-hidden
                 hover:border-[#00d1ff]/30 hover:shadow-[0_0_28px_rgba(0,209,255,0.10)] transition-all duration-300 flex flex-col"
    >
      {/* Top cyan accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#00d1ff] via-[#0090cc] to-transparent" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-2">
            {/* Region badge */}
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${regionStyle.bg} ${regionStyle.text} ${regionStyle.border}`}
            >
              <MapPin size={10} />
              {region}
            </span>
            {/* Status badge */}
            {status && (
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                  status === 'Completed'
                    ? 'bg-green-900/20 text-green-300 border-green-500/30'
                    : status === 'Ongoing'
                    ? 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30'
                    : 'bg-blue-900/20 text-blue-300 border-blue-500/30'
                }`}
              >
                {status}
              </span>
            )}
          </div>
          {/* Year chip */}
          <div className="flex items-center gap-1 text-xs text-[#00d1ff] font-mono bg-[#00d1ff]/10 px-2.5 py-0.5 rounded-full border border-[#00d1ff]/20 flex-shrink-0">
            <Calendar size={10} />
            {year}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[#e0f7ff] font-bold text-base leading-snug mb-2 group-hover:text-[#00d1ff] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Summary */}
        {summary && (
          <p className="text-[#7a9ab0] text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {summary}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          {duration && (
            <span className="flex items-center gap-1.5 text-xs text-[#7a9ab0]">
              <Clock size={11} />
              {duration}
            </span>
          )}
          <Link
            to={`/expeditions/${id}`}
            className="ml-auto flex items-center gap-1.5 text-sm font-medium text-[#00d1ff] hover:text-white transition-colors group/link"
          >
            View Expedition
            <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
