import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Users,
  LogOut,
  Menu,
  X,
  Sparkles,
  GaugeCircle,
  Settings,
} from 'lucide-react';
import { ThemeToggle } from '../components/ui/Toggle';
import { LiveBackdrop } from '../components/ui/LiveBackdrop';
import { useAuth } from '../hooks/useAuth';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Insightful overview' },
    { name: 'Objectives', href: '/objectives', icon: Target, description: 'Align goals & outcomes' },
    { name: 'Teams', href: '/teams', icon: Users, description: 'Collaborate with squads' },
    { name: 'Profile Settings', href: '/profile', icon: Settings, description: 'Personalize your experience' },
  ];
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      <LiveBackdrop />
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl border-r border-white/40 dark:border-slate-700/50 shadow-xl transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                <Sparkles size={26} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Aurora OKRs
                </h1>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                  Align. Focus. Win.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto scrollbar-hide">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center gap-4 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-white/80 hover:shadow-md dark:hover:bg-slate-800/70"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand/10 text-primary-600 dark:text-primary-300">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </span>
                  </div>
                  <GaugeCircle size={18} className="ml-auto text-gray-300 transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </nav>
          
          {/* User section */}
          <div className="p-6 border-t border-white/40 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white font-semibold shadow-floating">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-primary-600 transition-all hover:bg-primary-50 hover:shadow-sm dark:text-primary-300 dark:hover:bg-primary-900/20"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings size={16} />
                <span>Profile settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:shadow-sm dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 h-20 backdrop-blur-xl bg-white/70 dark:bg-slate-900/80 border-b border-white/40 dark:border-slate-700/50">
          <div className="flex items-center justify-between h-full px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex flex-1 items-center justify-center gap-8">
              <div className="hidden md:flex flex-col items-center text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
                  Today’s Snapshot
                </p>
                <div className="mt-1 flex items-center gap-3 rounded-full border border-white/50 bg-white/60 px-4 py-1 text-sm font-medium text-gray-700 shadow-inner dark:border-slate-600/50 dark:bg-slate-800/80 dark:text-gray-200">
                  <span className="flex items-center gap-1 text-primary-600 dark:text-primary-300">
                    <Sparkles size={16} /> Momentum
                  </span>
                  <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse"></span>
                  <span className="text-gray-500 dark:text-gray-400">Stay aligned across all teams</span>
                </div>
              </div>
            </div>
            
            <ThemeToggle />
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
