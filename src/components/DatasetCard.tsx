import { Download, ExternalLink, Database } from 'lucide-react';

interface DatasetCardProps {
  id: string;
  title: string;
  region?: string;
  year?: number | string;
  researchArea?: string;
  format?: string;
  size?: string;
  doi?: string;
  description?: string;
}

const FORMAT_STYLES: Record<string, { bg: string; text: string }> = {
  CSV: { bg: 'bg-green-900/30', text: 'text-green-300' },
  NetCDF: { bg: 'bg-blue-900/30', text: 'text-blue-300' },
  JSON: { bg: 'bg-yellow-900/30', text: 'text-yellow-300' },
  HDF5: { bg: 'bg-orange-900/30', text: 'text-orange-300' },
  GeoTIFF: { bg: 'bg-purple-900/30', text: 'text-purple-300' },
  MATLAB: { bg: 'bg-red-900/30', text: 'text-red-300' },
  Shapefile: { bg: 'bg-teal-900/30', text: 'text-teal-300' },
};

function getFormatStyle(format: string) {
  return (
    FORMAT_STYLES[format] ?? { bg: 'bg-gray-800/40', text: 'text-gray-300' }
  );
}

export default function DatasetCard({
  title,
  region,
  year,
  researchArea,
  format,
  size,
  doi,
  description,
}: DatasetCardProps) {
  const fmtStyle = format ? getFormatStyle(format) : null;

  const handleDownload = () => {
    alert(`Demo: Download initiated for "${title}".\n\nIn production, this would fetch the dataset from the data portal.`);
  };

  return (
    <div
      className="group bg-[#0d1233] border border-white/10 rounded-2xl p-5 flex flex-col gap-3
                 hover:border-[#00d1ff]/30 hover:shadow-[0_0_24px_rgba(0,209,255,0.10)] transition-all duration-300"
    >
      {/* Top row: format + year */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {format && fmtStyle && (
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded border border-white/10 ${fmtStyle.bg} ${fmtStyle.text}`}
            >
              {format}
            </span>
          )}
          {researchArea && (
            <span className="text-xs text-[#7a9ab0] bg-white/5 px-2 py-0.5 rounded">
              {researchArea}
            </span>
          )}
        </div>
        {year && (
          <span className="text-xs text-[#00d1ff] font-mono flex-shrink-0">{year}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[#e0f7ff] font-semibold text-sm leading-snug group-hover:text-[#00d1ff] transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[#7a9ab0] text-xs leading-relaxed line-clamp-2">{description}</p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3 text-xs text-[#7a9ab0] flex-wrap">
        {region && (
          <span className="flex items-center gap-1">
            <Database size={10} className="text-[#00d1ff]" />
            {region}
          </span>
        )}
        {size && <span>{size}</span>}
      </div>

      {/* DOI */}
      {doi && (
        <div className="bg-[#060914] rounded-lg px-3 py-2 border border-white/5">
          <p className="text-[10px] text-[#7a9ab0] mb-0.5 uppercase tracking-wider">DOI</p>
          <p className="text-xs text-[#00d1ff] font-mono break-all leading-snug">{doi}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
                     bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/30
                     hover:bg-[#00d1ff]/20 transition-colors"
        >
          <Download size={12} />
          Download
        </button>
        {doi && (
          <a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                       bg-white/5 text-[#a0c8d8] border border-white/10
                       hover:bg-white/10 transition-colors"
          >
            <ExternalLink size={12} />
            DOI
          </a>
        )}
      </div>
    </div>
  );
}
