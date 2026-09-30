import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LogIn, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/expeditions', label: 'Expeditions' },
  { to: '/stations', label: 'Stations' },
  { to: '/datasets', label: 'Datasets' },
  { to: '/publications', label: 'Publications' },
  { to: '/media', label: 'Media' },
  { to: '/learn', label: 'Learn' },
  { to: '/outreach', label: 'Outreach' },
];

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-600/20 text-red-300 border-red-500/40',
  researcher: 'bg-purple-600/20 text-purple-300 border-purple-500/40',
  educator: 'bg-green-600/20 text-green-300 border-green-500/40',
  student: 'bg-blue-600/20 text-blue-300 border-blue-500/40',
  public: 'bg-gray-600/20 text-gray-300 border-gray-500/40',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors duration-200 py-1 ${
      isActive
        ? 'text-[#00d1ff] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00d1ff] after:rounded-full'
        : 'text-[#a0c8d8] hover:text-[#e0f7ff]'
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e27]/95 backdrop-blur-md border-b border-[#00d1ff]/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-[#00d1ff] font-bold text-xl tracking-wide flex-shrink-0"
            >
              <span className="text-2xl">🔭</span>
              <span className="bg-gradient-to-r from-[#00d1ff] to-[#a0e8ff] bg-clip-text text-transparent">
                POLARIS
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[#00d1ff]" />
                    <span className="text-[#e0f7ff] text-sm font-medium">{user.name}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                      ROLE_COLORS[user.role] ?? ROLE_COLORS.public
                    }`}
                  >
                    {user.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm text-[#a0c8d8] hover:text-[#ff6b6b] transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border border-[#00d1ff]/40 text-[#00d1ff] hover:bg-[#00d1ff]/10 transition-colors"
                >
                  <LogIn size={14} />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-[#e0f7ff] p-2 rounded hover:bg-white/5 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0a0e27] flex flex-col">
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#00d1ff]/10">
            <Link
              to="/"
              className="text-[#00d1ff] font-bold text-xl"
              onClick={() => setMobileOpen(false)}
            >
              🔭 POLARIS
            </Link>
            <button
              className="text-[#e0f7ff] p-2 rounded hover:bg-white/5 transition"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-4">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-lg font-medium py-2 border-b border-white/5 ${
                    isActive ? 'text-[#00d1ff]' : 'text-[#a0c8d8]'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="px-6 pb-8 border-t border-[#00d1ff]/10 pt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-[#00d1ff]" />
                  <span className="text-[#e0f7ff] font-medium">{user.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border capitalize ml-auto ${
                      ROLE_COLORS[user.role] ?? ROLE_COLORS.public
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[#ff6b6b] text-sm"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-[#00d1ff] text-sm"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={14} />
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
