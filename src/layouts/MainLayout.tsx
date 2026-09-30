import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e27] text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-[#041024] border-t border-white/10 py-10 px-6 text-center text-[#e0f7ff]/50 text-sm">
        <p className="mb-2"><strong>POLARIS</strong> — Polar Science Intelligence & Outreach System</p>
        <p>A prototype developed for Smart India Hackathon 2026 (PS 26063) • Ministry of Earth Sciences</p>
      </footer>
    </div>
  );
};

export default MainLayout;
