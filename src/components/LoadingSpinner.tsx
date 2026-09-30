export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full py-20">
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#00d1ff]/20" />
        {/* Spinning arc */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00d1ff]"
          style={{ animation: 'spin 0.9s linear infinite' }}
        />
        {/* Inner dot */}
        <div className="absolute inset-[14px] rounded-full bg-[#00d1ff]/20" />
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
