import { ChevronDown } from 'lucide-react';

interface FilterDef {
  key: string;
  label: string;
  options: string[];
}

interface FilterBarProps {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}

export default function FilterBar({ filters, values, onChange }: FilterBarProps) {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <div key={filter.key} className="relative">
          <label className="sr-only">{filter.label}</label>
          <select
            value={values[filter.key] ?? ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="
              appearance-none pl-3 pr-8 py-2 rounded-xl text-sm
              bg-[#0d1233] text-[#e0f7ff]
              border border-white/10
              focus:outline-none focus:border-[#00d1ff]/60 focus:ring-1 focus:ring-[#00d1ff]/30
              transition-all duration-200 cursor-pointer
            "
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7a9ab0] pointer-events-none"
          />
        </div>
      ))}

      {/* Reset button if any filter is active */}
      {Object.values(values).some(Boolean) && (
        <button
          onClick={() => filters.forEach((f) => onChange(f.key, ''))}
          className="px-3 py-2 text-xs text-[#7a9ab0] hover:text-[#e0f7ff] border border-white/10 rounded-xl
                     hover:border-white/20 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
}
