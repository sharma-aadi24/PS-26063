// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { fetchStats, fetchEntity } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Expedition, OutreachItem } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentExpeditions, setRecentExpeditions] = useState<Expedition[]>([]);
  const [outreachItems, setOutreachItems] = useState<OutreachItem[]>([]);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
    fetchEntity<Expedition>('expeditions').then(data => setRecentExpeditions(data.slice(0, 5))).catch(console.error);
    fetchEntity<OutreachItem>('outreach').then(setOutreachItems).catch(console.error);
  }, []);

  const approveOutreach = (id: number) => {
    setOutreachItems(items => items.map(i => i.id === id ? { ...i, status: 'approved' } : i));
    fetch(`/api/outreach/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' })
    }).catch(console.error);
  };

  const chartData = [
    { name: '2020', expeditions: 2 },
    { name: '2021', expeditions: 1 },
    { name: '2022', expeditions: 3 },
    { name: '2023', expeditions: 2 },
    { name: '2024', expeditions: 2 },
  ];

  const pieData = [
    { name: 'Antarctica', value: 8, color: '#3b82f6' },
    { name: 'Arctic', value: 3, color: '#a855f7' },
    { name: 'Himalayas', value: 2, color: '#22c55e' },
    { name: 'Southern Ocean', value: 2, color: '#14b8a6' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between bg-[#0d1a3a] border border-white/10 rounded-xl p-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {user?.name}</h1>
            <p className="text-[#e0f7ff]/60">Your current role: <span className="text-[#00d1ff] font-mono">{user?.role}</span></p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/40 mb-1">System Status</div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> All Systems Online
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Expeditions', val: stats.totalExpeditions },
            { label: 'Datasets', val: stats.totalDatasets },
            { label: 'Publications', val: stats.totalPublications },
            { label: 'Media Items', val: stats.totalMedia },
            { label: 'Articles', val: stats.totalArticles },
            { label: 'Stations', val: stats.totalStations },
          ].map(s => (
            <div key={s.label} className="bg-[#0d1a3a]/60 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{s.val ?? '-'}</div>
              <div className="text-xs text-[#e0f7ff]/50">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0d1a3a] border border-white/10 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Expeditions by Year</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#ffffff40" tick={{fontSize: 12}} />
                  <YAxis stroke="#ffffff40" tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{background:'#0a0e27', border:'1px solid #00d1ff30', color:'#fff'}} />
                  <Bar dataKey="expeditions" fill="#00d1ff" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-[#0d1a3a] border border-white/10 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Recent Expeditions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-white/50 uppercase border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Region</th>
                      <th className="py-3 px-4">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExpeditions.map(e => (
                      <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 font-medium text-white">{e.title}</td>
                        <td className="py-3 px-4"><span className="text-xs border border-white/20 rounded px-2 py-0.5">{e.region}</span></td>
                        <td className="py-3 px-4">{e.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-[#0d1a3a] border border-white/10 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Datasets by Region</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{background:'#0a0e27', border:'1px solid #00d1ff30', color:'#fff'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1 text-xs text-white/60">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}} /> {d.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Outreach Approvals */}
            {(user?.role === 'admin' || user?.role === 'content_manager') && (
              <div className="bg-[#0d1a3a] border border-[#00d1ff]/30 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Pending Outreach Reviews</h3>
                {outreachItems.filter(i => i.status === 'draft').length === 0 ? (
                  <p className="text-sm text-white/50 text-center py-4">No pending items.</p>
                ) : (
                  <div className="space-y-3">
                    {outreachItems.filter(i => i.status === 'draft').map(i => (
                      <div key={i.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="font-medium text-white text-sm mb-1">{i.title}</div>
                        <div className="text-xs text-[#00d1ff] mb-2">{i.audience} · {i.contentType}</div>
                        <button onClick={() => approveOutreach(i.id)} className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 hover:bg-emerald-600/40 rounded py-1.5 text-xs font-bold transition">
                          Approve & Publish
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
