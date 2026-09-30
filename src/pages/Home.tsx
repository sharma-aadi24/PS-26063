// src/pages/Home.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Snowflake, Database, BookOpen, FlaskConical, Camera } from 'lucide-react';
import { fetchStats } from '../services/api';

const TIMELINE = [
  { year: 1981, title: 'First Indian Antarctic Expedition', desc: 'India sent its first expedition to Antarctica under the leadership of S.Z. Qasim.' },
  { year: 1984, title: 'Dakshin Gangotri Established', desc: 'India\'s first permanent Antarctic station was commissioned on 26 January 1984.' },
  { year: 1989, title: 'Maitri Station Inaugurated', desc: 'The modern Maitri station replaced Dakshin Gangotri as India\'s main Antarctic base.' },
  { year: 2008, title: 'Himadri Arctic Station', desc: 'India established Himadri station at Ny-Ålesund, Svalbard, entering Arctic research.' },
  { year: 2012, title: 'Bharati Station Built', desc: 'India\'s third Antarctic station — Bharati — was commissioned on the Prydz Bay coast.' },
  { year: 2019, title: 'NCPOR Established', desc: 'National Centre for Polar and Ocean Research became the nodal agency for all polar activities.' },
  { year: 2022, title: '42nd Antarctic Expedition', desc: 'Major expedition with ice core drilling, atmospheric research and winter-over operations.' },
  { year: 2024, title: 'India\'s Deepest Ice Core', desc: '500-metre ice core from Maitri — India\'s deepest ever — spanning 50,000 years of climate.' },
];

const SNAPSHOT = [
  { label: 'Antarctic Temp (Demo)', value: '−18°C', icon: <Snowflake size={24} />, color: 'text-blue-300' },
  { label: 'Sea Ice Coverage (Demo)', value: '13.2M km²', icon: <Globe2 size={24} />, color: 'text-cyan-300' },
  { label: 'Active Expeditions', value: '3', icon: <FlaskConical size={24} />, color: 'text-emerald-300' },
  { label: 'Research Stations', value: '5', icon: <Globe2 size={24} />, color: 'text-yellow-300' },
  { label: 'Total Datasets', value: '–', icon: <Database size={24} />, color: 'text-purple-300' },
  { label: 'Publications', value: '–', icon: <BookOpen size={24} />, color: 'text-pink-300' },
  { label: 'Media Items', value: '–', icon: <Camera size={24} />, color: 'text-orange-300' },
];

const regionColors: Record<string, string> = {
  'Antarctica': 'text-blue-400',
  'Arctic': 'text-purple-400',
  'Himalayas': 'text-green-400',
  'Southern Ocean': 'text-teal-400',
};

const Home: React.FC = () => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, []);

  // Animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles: { x: number; y: number; r: number; vy: number; opacity: number }[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      vy: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,247,255,${p.opacity})`;
        ctx.fill();
        p.y += p.vy;
        if (p.y > canvas.height) { p.y = -5; p.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const snapshotData = SNAPSHOT.map(s => {
    if (s.label === 'Total Datasets') return { ...s, value: String(stats.totalDatasets ?? '15') };
    if (s.label === 'Publications') return { ...s, value: String(stats.totalPublications ?? '20') };
    if (s.label === 'Media Items') return { ...s, value: String(stats.totalMedia ?? '30') };
    return s;
  });

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff]">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0d1a3a] to-[#041024]" />
        {/* Animated particles */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        {/* Globe SVG decoration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg width="700" height="700" viewBox="0 0 700 700">
            <circle cx="350" cy="350" r="300" stroke="#00d1ff" strokeWidth="1" fill="none" />
            <circle cx="350" cy="350" r="200" stroke="#00d1ff" strokeWidth="0.5" fill="none" />
            <circle cx="350" cy="350" r="100" stroke="#00d1ff" strokeWidth="0.5" fill="none" />
            <line x1="50" y1="350" x2="650" y2="350" stroke="#00d1ff" strokeWidth="0.5" />
            <line x1="350" y1="50" x2="350" y2="650" stroke="#00d1ff" strokeWidth="0.5" />
            <ellipse cx="350" cy="350" rx="300" ry="100" stroke="#00d1ff" strokeWidth="0.5" fill="none" />
            <ellipse cx="350" cy="350" rx="300" ry="200" stroke="#00d1ff" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          {/* Demo badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 rounded-full px-4 py-1 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            PROTOTYPE DEMO — SIH 2026 PS‑26063
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-[#00d1ff] text-5xl">🔭</span>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
              <span className="text-[#00d1ff]">POLARIS</span>
            </h1>
          </div>
          <p className="text-xl text-[#00d1ff]/70 font-medium mb-2 tracking-widest uppercase">
            Polar Science Intelligence & Outreach System
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore India's Polar Science
          </h2>
          <p className="text-lg text-[#e0f7ff]/70 mb-10 max-w-2xl mx-auto">
            Discover expeditions, research, datasets, publications, stories and the people
            exploring Earth's most extreme environments.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/explore"
              className="px-8 py-3 bg-[#00d1ff] text-[#0a0e27] font-bold rounded-lg hover:bg-[#00d1ff]/80 transition text-lg shadow-lg shadow-[#00d1ff]/20">
              🌍 Explore Polar World
            </Link>
            <Link to="/expeditions"
              className="px-8 py-3 border-2 border-[#00d1ff] text-[#00d1ff] font-bold rounded-lg hover:bg-[#00d1ff]/10 transition text-lg">
              🧊 View Expeditions
            </Link>
            <Link to="/login"
              className="px-8 py-3 border border-white/20 text-white/80 font-semibold rounded-lg hover:bg-white/5 transition text-lg">
              🔐 Demo Login
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/40 animate-bounce">
          <span className="text-sm">Scroll to explore</span>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* Live Polar Snapshot */}
      <section className="py-16 px-6 bg-[#0d1a3a]/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Live Polar Snapshot</h2>
            <span className="text-xs text-yellow-400 border border-yellow-400/40 rounded-full px-2 py-0.5 ml-auto">
              DEMO DATA
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {snapshotData.map((s, i) => (
              <div key={i}
                className="bg-[#0a0e27]/80 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center hover:border-[#00d1ff]/40 transition">
                <span className={s.color}>{s.icon}</span>
                <span className="text-2xl font-bold text-white mt-2">{s.value}</span>
                <span className="text-xs text-[#e0f7ff]/50 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* India's Polar Journey Timeline */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-10 text-center">India's Polar Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 bg-[#00d1ff]/30 h-full" />
            {TIMELINE.map((ev, i) => (
              <div key={i} className={`relative mb-8 flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2" />
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#00d1ff] text-[#0a0e27] font-bold text-xs z-10 cursor-pointer"
                  onClick={() => setExpandedEvent(expandedEvent === i ? null : i)}>
                  {ev.year.toString().slice(2)}
                </div>
                <div className={`w-1/2 ${i % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="bg-[#0d1a3a]/80 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-[#00d1ff]/40 transition"
                    onClick={() => setExpandedEvent(expandedEvent === i ? null : i)}>
                    <span className="text-[#00d1ff] font-mono text-sm">{ev.year}</span>
                    <h3 className="font-bold text-white mt-1">{ev.title}</h3>
                    {expandedEvent === i && (
                      <p className="text-[#e0f7ff]/70 text-sm mt-2">{ev.desc}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 px-6 bg-[#0d1a3a]/60">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Discover POLARIS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { to: '/expeditions', emoji: '🧊', title: 'Expeditions', desc: '10+ expeditions to Antarctica, Arctic & Himalayas' },
              { to: '/datasets', emoji: '📊', title: 'Datasets', desc: '15+ scientific datasets available for research' },
              { to: '/publications', emoji: '📚', title: 'Publications', desc: '20 peer-reviewed publications from polar research' },
              { to: '/media', emoji: '📷', title: 'Media Library', desc: '30 photographs and videos from the field' },
              { to: '/learn', emoji: '🎓', title: 'Learn', desc: 'Quizzes, missions and articles for students' },
              { to: '/outreach', emoji: '✨', title: 'Outreach Studio', desc: 'Generate public-facing polar science content' },
            ].map(card => (
              <Link key={card.to} to={card.to}
                className="group bg-[#0a0e27]/80 border border-white/10 rounded-xl p-6 hover:border-[#00d1ff]/50 hover:bg-[#0a0e27] transition">
                <span className="text-4xl mb-3 block">{card.emoji}</span>
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#00d1ff] transition">{card.title}</h3>
                <p className="text-[#e0f7ff]/60 text-sm">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          India generates world-class polar science.
        </h2>
        <p className="text-[#e0f7ff]/70 text-lg mb-8 max-w-xl mx-auto">
          POLARIS makes that knowledge discoverable, understandable, interactive and shareable.
        </p>
        <Link to="/explore"
          className="px-10 py-4 bg-[#00d1ff] text-[#0a0e27] font-extrabold rounded-xl text-xl hover:bg-[#00d1ff]/80 transition shadow-lg shadow-[#00d1ff]/30">
          Start Exploring →
        </Link>
      </section>
    </div>
  );
};

export default Home;
