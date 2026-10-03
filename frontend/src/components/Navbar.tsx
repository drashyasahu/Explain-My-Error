import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Terminal, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  History, 
  BarChart2, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/analyze', label: 'Analyze Error', icon: Terminal },
    { path: '/explain', label: 'Explain Code', icon: BookOpen },
    { path: '/review', label: 'Review Code', icon: CheckCircle2 },
    { path: '/sessions', label: 'Debug Sessions', icon: Layers },
    { path: '/history', label: 'History', icon: History },
    { path: '/statistics', label: 'Telemetry', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#18181B] border-b border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo - Solid Colors, No Gradients */}
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 rounded-md bg-[#27272A] border border-[#3F3F46] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[#0F766E]" />
            </div>
            <span className="font-mono font-bold text-base tracking-tight">
              <span className="text-[#FFFFFF]">Explain</span>
              <span className="text-[#0F766E]">MyError</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-[#FFFFFF] bg-[#27272A]'
                      : 'text-[#A1A1AA] hover:text-[#E4E4E7] hover:bg-[#27272A]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0F766E]' : 'text-[#A1A1AA]'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0F766E] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User / Authentication Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs text-[#E4E4E7] transition-colors"
                >
                  <div className="w-5 h-5 rounded bg-[#0F766E] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <SettingsIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-md text-[#A1A1AA] hover:text-[#DC2626] hover:bg-[#27272A] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[#E4E4E7] hover:text-white hover:bg-[#27272A] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-medium transition-colors shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-[#A1A1AA] hover:text-white hover:bg-[#27272A]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#27272A] space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-[#27272A] text-white'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#27272A]/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F766E]' : 'text-[#A1A1AA]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#27272A] flex items-center justify-between">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#E4E4E7] flex items-center gap-2 px-3 py-2"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="text-xs text-[#DC2626] px-3 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 w-full px-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-1.5 rounded-md text-xs text-[#E4E4E7] bg-[#27272A]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-1.5 rounded-md text-xs text-white bg-[#0F766E]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
