import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export default function StatCard({ label, value, icon, color = '#00d1ff' }: StatCardProps) {
  return (
    <div
      className="group relative bg-[#0d1233] border border-white/10 rounded-2xl p-5 flex items-start gap-4
                 hover:border-[#00d1ff]/40 hover:shadow-[0_0_24px_rgba(0,209,255,0.12)] transition-all duration-300 cursor-default"
    >
      {/* Icon bubble */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}30`,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0">
        <p
          className="text-3xl font-bold leading-none tracking-tight"
          style={{ color }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="mt-1 text-sm text-[#7a9ab0] font-medium">{label}</p>
      </div>

      {/* Corner glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${color}08, transparent 60%)`,
        }}
      />
    </div>
  );
}
