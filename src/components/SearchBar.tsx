import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (q: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search…',
  initialValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onSearch]);

  return (
    <div className="relative w-full">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a9ab0] pointer-events-none">
        <Search size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-4 py-2.5 rounded-xl
          bg-[#0d1233] text-[#e0f7ff] placeholder-[#7a9ab0]
          border border-white/10
          focus:outline-none focus:border-[#00d1ff]/60 focus:ring-1 focus:ring-[#00d1ff]/30
          transition-all duration-200 text-sm
        "
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a9ab0] hover:text-[#e0f7ff] transition-colors text-lg leading-none"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
