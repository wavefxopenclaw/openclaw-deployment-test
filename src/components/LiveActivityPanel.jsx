import { Activity, Bot, Radio } from 'lucide-react';
import { EmptyState, ShellCard } from './ui';

const toneClasses = {
  cyan: 'bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.35)]',
  warning: 'bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.3)]',
  danger: 'bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.35)]',
  success: 'bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.3)]',
  accent: 'bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.35)]',
  muted: 'bg-slate-500',
};

export function LiveActivityPanel({ feed, agents }) {
  return (
    <div className="space-y-4">
      <ShellCard title="Live activity" eyebrow="Realtime feed" action={<Radio size={16} className="text-cyan-300" />} className="border-cyan-400/10 bg-slate-900/65">
        <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
          {feed.length ? (
            feed.map((item, index) => (
              <div key={`${item.agent}-${item.time}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className={`h-2.5 w-2.5 rounded-full ${toneClasses[item.tone] || toneClasses.muted}`} />
                  <span className="truncate text-white">{item.agent}</span>
                  <span>{item.time}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.event}</p>
              </div>
            ))
          ) : (
            <EmptyState title="No live activity" body="No recent events were returned by the API." />
          )}
        </div>
      </ShellCard>

      <ShellCard title="Agent observability" eyebrow="Runtime state" action={<Activity size={16} className="text-violet-300" />} className="border-violet-400/10 bg-slate-900/65">
        <div className="space-y-3">
          {agents.length ? (
            agents.map((agent) => (
              <div key={agent.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-cyan-300">
                      <Bot size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{agent.name}</p>
                      <p className="text-xs text-slate-500">{agent.status} · {agent.lastHeartbeat}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">${agent.estimatedCost?.toFixed?.(2) ?? agent.estimatedCost}</span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="No agents visible" body="The API did not return any agent sessions." />
          )}
        </div>
      </ShellCard>
    </div>
  );
}
