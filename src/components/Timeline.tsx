import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineEvent {
  year: number | string;
  title: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00d1ff]/0 via-[#00d1ff]/40 to-[#00d1ff]/0 hidden md:block" />
      {/* Mobile line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#00d1ff]/0 via-[#00d1ff]/40 to-[#00d1ff]/0 md:hidden" />

      <div className="space-y-10">
        {events.map((event, idx) => {
          const isLeft = idx % 2 === 0;
          const isExpanded = expandedIdx === idx;

          return (
            <div
              key={idx}
              className={`relative flex items-start gap-4 md:gap-0 ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content card – desktop: half-width */}
              <div
                className={`
                  ml-14 md:ml-0 flex-1
                  ${isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'}
                  animate-[fadeSlideIn_0.4s_ease_both]
                `}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div
                  className={`inline-block bg-[#0d1233] border border-white/10 rounded-2xl p-4 cursor-pointer
                              hover:border-[#00d1ff]/30 hover:shadow-[0_0_20px_rgba(0,209,255,0.10)]
                              transition-all duration-300 text-left w-full ${isLeft ? 'md:text-right' : 'md:text-left'}`}
                  onClick={() => toggle(idx)}
                >
                  {/* Year */}
                  <div
                    className={`text-xs text-[#00d1ff] font-mono mb-1 ${
                      isLeft ? 'md:text-right' : 'md:text-left'
                    }`}
                  >
                    {event.year}
                  </div>

                  {/* Title row */}
                  <div className={`flex items-center gap-2 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                    {event.icon && <span className="text-xl flex-shrink-0">{event.icon}</span>}
                    <h3 className="text-[#e0f7ff] font-semibold text-sm leading-snug flex-1">
                      {event.title}
                    </h3>
                    <button
                      className="text-[#7a9ab0] hover:text-[#00d1ff] transition-colors flex-shrink-0"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Description (expandable) */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className={`text-[#a0c8d8] text-xs leading-relaxed ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute left-5 md:left-1/2 top-5 -translate-x-1/2 flex items-center justify-center z-10">
                <div className="w-3 h-3 rounded-full bg-[#00d1ff] shadow-[0_0_10px_rgba(0,209,255,0.8)] border-2 border-[#0a0e27]" />
              </div>

              {/* Spacer for opposite side on desktop */}
              <div className="hidden md:block flex-1" />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
