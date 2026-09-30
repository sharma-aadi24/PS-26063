import { ExternalLink, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface PublicationCardProps {
  id: string;
  title: string;
  authors?: string[];
  year?: number | string;
  journal?: string;
  doi?: string;
  abstract?: string;
  researchArea?: string;
}

function formatAuthors(authors: string[]): string {
  if (!authors || authors.length === 0) return '';
  if (authors.length <= 3) return authors.join(', ');
  return `${authors.slice(0, 3).join(', ')} et al.`;
}

const AREA_COLORS: Record<string, string> = {
  Glaciology: 'text-blue-300 bg-blue-900/20 border-blue-500/30',
  Oceanography: 'text-teal-300 bg-teal-900/20 border-teal-500/30',
  Climatology: 'text-orange-300 bg-orange-900/20 border-orange-500/30',
  Biology: 'text-green-300 bg-green-900/20 border-green-500/30',
  Geology: 'text-yellow-300 bg-yellow-900/20 border-yellow-500/30',
  Meteorology: 'text-purple-300 bg-purple-900/20 border-purple-500/30',
  'Remote Sensing': 'text-cyan-300 bg-cyan-900/20 border-cyan-500/30',
};

export default function PublicationCard({
  title,
  authors = [],
  year,
  journal,
  doi,
  abstract,
  researchArea,
}: PublicationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const areaColor =
    (researchArea && AREA_COLORS[researchArea]) ||
    'text-gray-300 bg-gray-800/30 border-gray-500/30';

  return (
    <div
      className="group bg-[#0d1233] border border-white/10 rounded-2xl p-5 flex flex-col gap-3
                 hover:border-[#00d1ff]/20 transition-all duration-300"
    >
      {/* Top: area + year */}
      <div className="flex items-center justify-between gap-2">
        {researchArea && (
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${areaColor}`}>
            {researchArea}
          </span>
        )}
        {year && (
          <span className="text-xs text-[#00d1ff] font-mono ml-auto">{year}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[#e0f7ff] font-semibold text-sm leading-snug group-hover:text-[#00d1ff] transition-colors">
        {title}
      </h3>

      {/* Authors */}
      {authors.length > 0 && (
        <p className="text-[#a0c8d8] text-xs font-medium">{formatAuthors(authors)}</p>
      )}

      {/* Journal */}
      {journal && (
        <p className="text-[#7a9ab0] text-xs italic flex items-center gap-1.5">
          <BookOpen size={11} className="text-[#00d1ff]" />
          {journal}
        </p>
      )}

      {/* Abstract (expandable) */}
      {abstract && (
        <div>
          <p
            className={`text-[#7a9ab0] text-xs leading-relaxed transition-all duration-200 ${
              expanded ? '' : 'line-clamp-2'
            }`}
          >
            {abstract}
          </p>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 text-xs text-[#00d1ff]/70 hover:text-[#00d1ff] flex items-center gap-0.5 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp size={12} /> Less
              </>
            ) : (
              <>
                <ChevronDown size={12} /> More
              </>
            )}
          </button>
        </div>
      )}

      {/* DOI */}
      {doi && (
        <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          <p className="text-[10px] text-[#7a9ab0] font-mono break-all">{doi}</p>
          <a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1 text-xs text-[#00d1ff] hover:text-white transition-colors"
          >
            <ExternalLink size={11} />
            View
          </a>
        </div>
      )}
    </div>
  );
}
