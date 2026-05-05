'use client';

import { ShieldCheck, Users, Sparkles } from 'lucide-react';

interface StatusCardsProps {
  userCount: number;
  visitorHits: number | string;
  uniqueIPs: number | string;
  loading: boolean;
}

export default function StatusCards({ userCount, visitorHits, uniqueIPs, loading }: StatusCardsProps) {
  const cards = [
    { label: 'Registered Accounts', value: loading ? 'Loading…' : userCount.toLocaleString(), icon: Users, accent: 'from-[#d49a69] to-[#9c6b3a]' },
    { label: 'Live Visitor Hits', value: loading ? 'Loading…' : visitorHits, icon: Sparkles, accent: 'from-[#c6985b] to-[#b27037]' },
    { label: 'Unique IPs', value: loading ? 'Loading…' : uniqueIPs, icon: ShieldCheck, accent: 'from-[#d8b08c] to-[#8c6233]' },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="glass-card rounded-3xl border border-white/10 p-6 shadow-softGlow transition hover:shadow-glow">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{card.label}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{card.value}</p>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${card.accent} text-[#1a1209] shadow-glow`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 h-1 w-full rounded-full bg-slate-800" />
          </div>
        );
      })}
    </div>
  );
}
