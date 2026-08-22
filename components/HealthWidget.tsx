'use client';

import { useEffect, useState } from 'react';
import { CircleDot, ServerCog, Wifi } from 'lucide-react';
import api from '@/lib/axios';

interface HealthState {
  database: string;
  status: string;
  env: string;
  checkedAt: string;
}

const initialState: HealthState = {
  database: 'disconnected',
  status: 'Unknown',
  env: 'unknown',
  checkedAt: '—',
};

export default function HealthWidget() {
  const [health, setHealth] = useState<HealthState>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHealth = async () => {
      try {
        setLoading(true);
        const response = await api.get('/health');
        if (!isMounted) return;
        setHealth({
          database: response.data.database || 'disconnected',
          status: response.data.success ? 'Online' : 'Offline',
          env: response.data.env || 'unknown',
          checkedAt: response.data.timestamp || new Date().toISOString(),
        });
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError('Unable to reach health endpoint.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchHealth();
    const timer = window.setInterval(fetchHealth, 30000);
    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const isConnected = health.database.toLowerCase().includes('connected');

  return (
    <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-softGlow">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#d8b08c]/80">Live Health Monitor</p>
          <h2 className="mt-2 text-xl font-semibold text-white">System Health Status</h2>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${isConnected ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
          <CircleDot className={`h-4 w-4 ${isConnected ? 'text-[#ffd8ae]' : 'text-rose-300'}`} />
          {isConnected ? 'Database connected' : 'Database offline'}
        </span>
      </div>
      <div className="grid gap-4">
        <div className="rounded-3xl bg-slate-950/80 p-4">
          <div className="flex items-center gap-3 text-slate-400">
            <ServerCog className="h-5 w-5 text-[#d29b6f]" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">API Endpoint</p>
              <p className="text-sm text-slate-200">/health</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-3xl bg-slate-950/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-sm">Server status</p>
            <p className="font-semibold text-white">{loading ? 'Checking...' : error ? 'Unavailable' : health.status}</p>
          </div>
          <div className="flex items-center justify-between text-[#c8b19a]">
            <p className="text-sm">Database</p>
            <p className="font-semibold text-white">{health.database}</p>
          </div>
          <div className="flex items-center justify-between text-[#c8b19a]">
            <p className="text-sm">Environment</p>
            <p className="font-semibold text-white">{health.env}</p>
          </div>
          <div className="flex items-center justify-between text-[#c8b19a]">
            <p className="text-sm">Checked</p>
            <p className="font-semibold text-white">{new Date(health.checkedAt).toLocaleString()}</p>
          </div>
          {error && <p className="rounded-2xl bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{error}</p>}
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-slate-900/20 via-slate-800/10 to-slate-900/20 p-4 shadow-glow">
          <div className="flex items-center gap-3 text-slate-100">
            <Wifi className="h-5 w-5 text-slate-400" />
            <p className="text-sm leading-6">
              Live backend health checks are served from the TechexaVision Vercel API and refresh automatically every 30 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
