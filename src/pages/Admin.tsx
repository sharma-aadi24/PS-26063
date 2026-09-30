// src/pages/Admin.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { fetchEntity } from '../services/api';

type Tab = 'Expeditions' | 'Datasets' | 'Publications' | 'Media' | 'Outreach';
const TABS: Tab[] = ['Expeditions', 'Datasets', 'Publications', 'Media', 'Outreach'];

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('Expeditions');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const entity = tab.toLowerCase();
    fetchEntity<any>(entity)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-4xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h1>
          <p className="text-[#e0f7ff]/60">You need Administrator privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">System Administration</h1>
            <p className="text-[#e0f7ff]/60">Manage content, users, and platform settings. (Prototype)</p>
          </div>
          <button className="px-4 py-2 bg-[#00d1ff] text-[#0a0e27] font-bold rounded-lg hover:bg-[#00d1ff]/80 transition">
            + Add New {tab.slice(0, -1)}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${tab === t ? 'bg-white/10 text-white border border-white/20' : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-[#0d1a3a]/80 border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-white/50">Loading data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-black/20 text-white/60 uppercase text-xs border-b border-white/10">
                  <tr>
                    <th className="py-4 px-6 font-medium">ID</th>
                    <th className="py-4 px-6 font-medium">Title</th>
                    <th className="py-4 px-6 font-medium">Secondary Info</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-white/5 transition">
                      <td className="py-4 px-6 font-mono text-white/40">{item.id}</td>
                      <td className="py-4 px-6 font-medium text-white max-w-xs truncate">{item.title}</td>
                      <td className="py-4 px-6 text-white/60">
                        {tab === 'Expeditions' && `${item.region} · ${item.year}`}
                        {tab === 'Datasets' && `${item.format} · ${item.researchArea}`}
                        {tab === 'Publications' && `${item.year} · ${item.journal}`}
                        {tab === 'Media' && `${item.type} · ${item.location}`}
                        {tab === 'Outreach' && `${item.audience} · ${item.contentType}`}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                          item.status === 'published' || tab !== 'Outreach' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          item.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {item.status || 'Published'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button className="text-[#00d1ff] hover:text-white transition">Edit</button>
                        <button className="text-red-400 hover:text-red-300 transition">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/50">No data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
