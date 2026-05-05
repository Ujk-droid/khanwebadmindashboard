'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

interface AnalyticsPanelsProps {
  users: UserType[];
  visitors: VisitorType[];
  loading: boolean;
}

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(dateString));

const rangeDays = (days: number) => {
  return Array.from({ length: days }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return date;
  });
};

export default function AnalyticsPanels({ users, visitors, loading }: AnalyticsPanelsProps) {
  const userGrowthData = rangeDays(7).map((date) => {
    const label = formatDate(date.toISOString());
    const value = users.filter((user) => new Date(user.createdAt).toDateString() === date.toDateString()).length;
    return { label, users: value };
  });

  const authPathData = visitors
    .filter((visit) => /auth|login|logout/i.test(visit.path))
    .reduce<Record<string, number>>((acc, visit) => {
      const key = visit.path || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const defaultPathData = visitors.reduce<Record<string, number>>((acc, visit) => {
    const key = visit.path || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const authData = Object.entries(authPathData).length > 0
    ? Object.entries(authPathData).map(([path, count]) => ({ category: path, count }))
    : Object.entries(defaultPathData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, count]) => ({ category: path, count }));

  const visitorTrendData = rangeDays(7).map((date) => {
    const label = formatDate(date.toISOString());
    const hits = visitors.filter((visit) => new Date(visit.createdAt).toDateString() === date.toDateString()).length;
    return { label, hits };
  });

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-softGlow">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#d8b08c]/80">User Growth</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Registrations Over Time</h2>
          </div>
          <span className="rounded-full bg-[#241610]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#e6d6bf]">
            7 days
          </span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowthData} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="copperGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d38c4a" stopOpacity={0.95} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#d8c1a1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1b1209', border: '1px solid rgba(210,146,100,0.18)', borderRadius: 16 }} itemStyle={{ color: '#fff' }} />
              <Area type="monotone" dataKey="users" stroke="#d38c4a" strokeWidth={3} fill="url(#copperGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-softGlow">
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d8b08c]/80">Request Logs</p>
            <h2 className="mt-2 text-xl font-semibold text-white">JWT & Traffic Activity</h2>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={authData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
                <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#d8c1a1', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1b1209', border: '1px solid rgba(210,146,100,0.18)', borderRadius: 16 }} itemStyle={{ color: '#fff' }} />
                <Bar dataKey="count" radius={[12, 12, 0, 0]} fill="#d38c4a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-softGlow">
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d8b08c]/80">Request Trend</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Visitor Hit Trend</h2>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorTrendData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#d8c1a1', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1b1209', border: '1px solid rgba(210,146,100,0.18)', borderRadius: 16 }} itemStyle={{ color: '#fff' }} />
                <Line type="monotone" dataKey="hits" stroke="#d38c4a" strokeWidth={3} dot={{ r: 4, fill: '#e6cc9d' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
