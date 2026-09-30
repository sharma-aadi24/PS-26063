// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Lock, User, Users, FlaskConical, LayoutDashboard, Settings } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoLogin = (role: 'public' | 'student' | 'researcher' | 'content_manager' | 'admin') => {
    login(role);
    navigate('/dashboard');
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(username && password) {
      handleDemoLogin('admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d1a3a] via-[#0a0e27] to-[#041024]" />
      <div className="absolute w-[800px] h-[800px] bg-[#00d1ff]/5 rounded-full blur-[100px] -top-1/4 -right-1/4" />
      <div className="absolute w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] -bottom-1/4 -left-1/4" />

      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-8 items-stretch">
        {/* Standard Login Panel */}
        <div className="bg-[#0d1a3a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
          <div className="mb-8 text-center">
            <div className="text-4xl mb-4">🔭</div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Welcome to POLARIS</h1>
            <p className="text-[#e0f7ff]/60 text-sm">Polar Science Intelligence & Outreach System</p>
          </div>

          <form onSubmit={handleStandardLogin} className="space-y-4 mb-8">
            <div>
              <label className="block text-xs text-white/50 mb-1 ml-1 font-medium">Username or Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30" size={18} />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                  className="w-full bg-[#0a0e27] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#00d1ff]/50 transition" 
                  placeholder="Enter your username" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1 ml-1 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30" size={18} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full bg-[#0a0e27] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#00d1ff]/50 transition" 
                  placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#00d1ff] text-[#0a0e27] font-bold py-3 rounded-xl hover:bg-[#00d1ff]/90 transition shadow-lg shadow-[#00d1ff]/20">
              Sign In
            </button>
          </form>
          <div className="text-center text-xs text-white/30">
            NCPOR Intranet Credentials required for staff access.
          </div>
        </div>

        {/* Demo Mode Panel */}
        <div className="bg-[#00d1ff]/5 border border-[#00d1ff]/20 rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold rounded-full mb-4">SIH PROTOTYPE</span>
            <h2 className="text-xl font-bold text-white mb-2">Fast-track Demo Access</h2>
            <p className="text-sm text-[#e0f7ff]/70">Select a persona below to experience different feature access levels within the prototype.</p>
          </div>

          <div className="space-y-3">
            <button onClick={() => handleDemoLogin('public')} className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition text-left group">
              <div className="flex items-center gap-3"><Users className="text-[#00d1ff]" size={20} /><span className="text-white font-medium group-hover:text-[#00d1ff] transition">Public User</span></div>
              <span className="text-xs text-white/40">Read-only</span>
            </button>
            <button onClick={() => handleDemoLogin('researcher')} className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition text-left group">
              <div className="flex items-center gap-3"><FlaskConical className="text-purple-400" size={20} /><span className="text-white font-medium group-hover:text-purple-400 transition">Researcher</span></div>
              <span className="text-xs text-white/40">Upload Data</span>
            </button>
            <button onClick={() => handleDemoLogin('content_manager')} className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition text-left group">
              <div className="flex items-center gap-3"><LayoutDashboard className="text-emerald-400" size={20} /><span className="text-white font-medium group-hover:text-emerald-400 transition">Content Manager</span></div>
              <span className="text-xs text-white/40">Review Outreach</span>
            </button>
            <button onClick={() => handleDemoLogin('admin')} className="w-full flex items-center justify-between p-4 rounded-xl border border-[#00d1ff]/30 bg-[#00d1ff]/10 hover:bg-[#00d1ff]/20 hover:border-[#00d1ff]/50 transition text-left group">
              <div className="flex items-center gap-3"><Settings className="text-[#00d1ff]" size={20} /><span className="text-white font-bold group-hover:text-white transition">System Admin</span></div>
              <span className="text-xs text-[#00d1ff]">Full Access</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
