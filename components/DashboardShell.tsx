'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Cpu, LayoutDashboard, ShieldCheck, Sparkles, Users, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/axios';
import AnalyticsPanels from './AnalyticsPanels';
import HealthWidget from './HealthWidget';
import StatusCards from './StatusCards';
import UserManagementTable from './UserManagementTable';

interface UserType {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

interface VisitorType {
  id: string;
  path: string;
  device?: string;
  city?: string;
  createdAt: string;
}

interface TrackingStats {
  totalVisitors: number;
  uniqueIPs: number;
  byPath: Array<{ path: string; _count: number }>;
  byDevice: Array<{ device: string; _count: number }>;
  byCity: Array<{ city: string; _count: number }>;
}

const navigation = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Analytics', icon: BarChart3, active: false },
  { label: 'Health', icon: ShieldCheck, active: false },
  { label: 'Users', icon: Users, active: false },
  { label: 'System', icon: Cpu, active: false },
];

export default function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [visitors, setVisitors] = useState<VisitorType[]>([]);
  const [stats, setStats] = useState<TrackingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { logout } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes, visitorsRes] = await Promise.allSettled([
        api.get('/users'),
        api.get('/tracking/stats'),
        api.get('/tracking/visitors?limit=100'),
      ]);

      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value.data.data || []);
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data.data || null);
      }

      if (visitorsRes.status === 'fulfilled') {
        setVisitors(visitorsRes.value.data.data || []);
      }

      if ([usersRes, statsRes, visitorsRes].some((res) => res.status === 'rejected')) {
        setApiError(
          'Admin endpoints require a valid admin JWT in NEXT_PUBLIC_TECH_EXA_ADMIN_TOKEN. Public health data is still available.',
        );
      } else {
        setApiError(null);
      }
    } catch (error) {
      setApiError('Unable to fetch live admin data from the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#b27548]/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-[#7c4a22]/20 blur-3xl" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(190,137,80,0.20),_transparent_32%)]" />

      <div className="mx-auto flex min-h-screen max-w-[1700px] flex-col px-4 py-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-softGlow backdrop-blur-xl">
          <div className="relative">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-8 top-4 h-24 w-24 rounded-full bg-[#bf8a56]/30 blur-3xl"
            />
            <motion.div
              animate={{ x: [0, 10, 0], y: [0, -6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-6 top-8 h-20 w-20 rounded-full bg-[#8d5d35]/30 blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -12, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-16 top-24 h-16 w-16 rounded-full bg-[#e0b885]/20 blur-3xl"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#d8b08c]/80">TechexaVision</p>
              <h1 className="mt-3 text-4xl font-semibold text-[#f6e7d2] sm:text-5xl">Live Admin Dashboard</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#e7d7c2]/90">
                Connected to the TechexaVision Vercel backend. System health, user activity, and request analytics are now presented in a rich brown, copper, and tan brand palette.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-[#c0894e] via-[#b46d32] to-[#e2c99d] px-5 py-3 text-sm font-semibold text-[#1c1107] shadow-glow transition hover:brightness-105"
            >
              <Sparkles className="h-4 w-4" />
              Refresh Live Data
            </button>
          </div>

          {apiError ? (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-sm text-slate-300">
              {apiError}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className={`glass-card max-h-[calc(100vh-96px)] overflow-hidden rounded-3xl border border-slate-800 p-5 transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden'} xl:block`}>
            <div className="mb-6 rounded-3xl bg-slate-950/80 p-4 text-slate-400 shadow-glow">
              <p className="text-xs uppercase tracking-[0.28em] text-[#e1c7a2]/80">Navigation</p>
              <p className="mt-3 text-sm text-[#f4e7d3]">Explore TechexaVision analytics, live health checks, and admin user management.</p>
            </div>
            <nav className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${item.active ? 'border-[#d8b08c]/40 bg-[#c08f57]/10 text-white shadow-glow' : 'border-white/5 bg-slate-900/80 text-slate-400 hover:border-[#cfa678]/30 hover:bg-slate-900/95 hover:text-white'}`}
                  >
                    <Icon className="h-5 w-5 text-[#d8b08c]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={logout}
                className="group flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/80 px-4 py-4 text-left text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-5 w-5 text-red-400" />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          <section className="space-y-6">
            <StatusCards userCount={users.length} visitorHits={stats?.totalVisitors ?? '—'} uniqueIPs={stats?.uniqueIPs ?? '—'} loading={loading} />

            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <AnalyticsPanels users={users} visitors={visitors} loading={loading} />
              <HealthWidget />
            </div>

            <UserManagementTable users={users} loading={loading} error={apiError} onUsersUpdate={fetchData} />
          </section>
        </div>
      </div>
    </main>
  );
}
