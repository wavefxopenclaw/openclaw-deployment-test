import { useEffect, useMemo, useState } from 'react';
import { api, API_BASE } from './api';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CirclePause,
  Gauge,
  RefreshCcw,
  Shield,
  SquareTerminal,
  Wallet,
  Waves,
} from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const toneMap = {
  cyan: 'text-cyan-300 border-cyan-400/20 bg-cyan-400/10',
  warning: 'text-amber-300 border-amber-400/20 bg-amber-400/10',
  success: 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10',
  danger: 'text-rose-300 border-rose-400/20 bg-rose-400/10',
  accent: 'text-violet-300 border-violet-400/20 bg-violet-400/10',
  muted: 'text-slate-300 border-slate-400/20 bg-slate-400/10',
};

const statusPill = {
  idle: 'bg-slate-500/15 text-slate-300',
  running: 'bg-cyan-500/15 text-cyan-300',
  blocked: 'bg-amber-500/15 text-amber-300',
  failed: 'bg-rose-500/15 text-rose-300',
  waiting: 'bg-violet-500/15 text-violet-300',
};

const emptyDashboard = {
  generatedAt: null,
  status: {},
  summary: [],
  agents: [],
  tasks: [],
  feed: [],
  alerts: [],
  timeline: [],
  usageByAgent: [],
  usageByModel: [],
  reliability: [],
};

function ShellCard({ title, eyebrow, children, action }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 shadow-glow backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          {eyebrow && <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>}
          <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function SidebarItem({ icon: Icon, label, active }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function App() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDashboard() {
    try {
      if (!dashboard.generatedAt) setLoading(true);
      const json = await api.dashboard();
      setDashboard(json);
      setSelectedId((current) => current || json.agents?.[0]?.id || null);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    const timer = setInterval(loadDashboard, 15000);
    return () => clearInterval(timer);
  }, []);

  const selected = useMemo(() => dashboard.agents.find((agent) => agent.id === selectedId) || dashboard.agents[0], [dashboard.agents, selectedId]);
  const gatewayReachable = dashboard.status?.gateway?.reachable;
  const usageWindows = dashboard.status?.usage?.providers?.[0]?.windows || [];

  return (
    <div className="min-h-screen bg-slate-950 text-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_30%),radial-gradient(circle_at_right,rgba(34,211,238,0.12),transparent_24%),linear-gradient(to_bottom,rgba(15,23,42,0.7),rgba(2,6,23,1))]" />
      <div className="pointer-events-none fixed inset-0 bg-grid bg-[size:24px_24px] opacity-[0.06]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1680px] gap-6 p-4 lg:p-6">
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-glow backdrop-blur-xl lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20">
              <Waves size={22} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">OpenClaw</p>
              <h1 className="text-lg font-semibold text-white">Mission Control</h1>
            </div>
          </div>

          <div className="space-y-2">
            <SidebarItem icon={Gauge} label="Overview" active />
            <SidebarItem icon={Bot} label="Agent Fleet" />
            <SidebarItem icon={SquareTerminal} label="Execution Trace" />
            <SidebarItem icon={AlertTriangle} label="Alerts & Guardrails" />
            <SidebarItem icon={Wallet} label="Cost & Usage" />
            <SidebarItem icon={Shield} label="Human Oversight" />
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/10 to-violet-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Live OpenClaw source</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              API layer reads real session/status/usage data from local OpenClaw CLI surfaces and transcript files.
            </p>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="rounded-[28px] border border-white/10 bg-slate-900/70 px-5 py-4 shadow-glow backdrop-blur-xl">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Fleet observability</p>
                <h2 className="mt-2 text-2xl font-semibold text-white lg:text-3xl">AI operations center for OpenClaw agents</h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-400 lg:text-base">
                  Real session state, transcript-derived logs, model usage, and operator-facing controls through a configurable API layer.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  API source: {API_BASE || 'same-origin /api'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={loadDashboard} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10">
                  <RefreshCcw size={16} /> Refresh
                </button>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ['Gateway', gatewayReachable ? 'Reachable' : 'Offline'],
                    ['Security warns', String(dashboard.status?.securityAudit?.summary?.warn ?? 0)],
                    ['5h usage', usageWindows[0] ? `${usageWindows[0].usedPercent}%` : 'n/a'],
                    ['Last sync', dashboard.generatedAt ? new Date(dashboard.generatedAt).toLocaleTimeString() : 'loading'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {error && <p className="mt-4 text-sm text-rose-300">API error: {error}</p>}
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {(loading && dashboard.summary.length === 0 ? [{ label: 'Loading', value: '...', delta: 'Waiting for OpenClaw API', tone: 'muted' }] : dashboard.summary).map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
                <div className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${toneMap[item.tone] || toneMap.muted}`}>
                  {item.label}
                </div>
                <div className="mt-5 text-3xl font-semibold text-white">{item.value}</div>
                <p className="mt-2 text-sm text-slate-400">{item.delta}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
            <ShellCard title="Live fleet activity" eyebrow="Event stream" action={<button className="text-sm text-cyan-300">Auto-refresh 15s</button>}>
              <div className="space-y-3">
                {dashboard.feed.map((item) => (
                  <div key={`${item.time}-${item.agent}`} className="flex items-start gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                    <div className={`mt-1 h-2.5 w-2.5 rounded-full ${item.tone === 'danger' ? 'bg-rose-400' : item.tone === 'warning' ? 'bg-amber-400' : item.tone === 'success' ? 'bg-emerald-400' : item.tone === 'cyan' ? 'bg-cyan-400' : item.tone === 'accent' ? 'bg-violet-400' : 'bg-slate-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-white">{item.agent}</span>
                        <span className="text-slate-500">{item.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-300">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard title="Alerts and incidents" eyebrow="Operational trust" action={<AlertTriangle className="text-amber-300" size={18} />}>
              <div className="space-y-3">
                {dashboard.alerts.map((alert) => (
                  <div key={alert.title + alert.detail} className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs uppercase tracking-wide ${alert.severity === 'critical' ? 'bg-rose-500/15 text-rose-300' : alert.severity === 'warning' ? 'bg-amber-500/15 text-amber-300' : 'bg-cyan-500/15 text-cyan-300'}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-500">Owner: {alert.owner}</span>
                    </div>
                    <h4 className="mt-3 font-semibold text-white">{alert.title}</h4>
                    <p className="mt-1 text-sm text-slate-400">{alert.detail}</p>
                  </div>
                ))}
              </div>
            </ShellCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ShellCard title="Agent fleet" eyebrow="Realtime roster" action={<button className="inline-flex items-center gap-2 text-sm text-cyan-300">Live sessions <ArrowRight size={16} /></button>}>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr className="border-b border-white/5">
                      {['Agent', 'Role', 'Current task', 'Status', 'Model', 'Heartbeat', 'Tokens', 'Cost'].map((head) => (
                        <th key={head} className="pb-3 pr-4 font-medium">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.agents.map((agent) => (
                      <tr key={agent.id} className="cursor-pointer border-b border-white/5 last:border-0 hover:bg-white/[0.03]" onClick={() => setSelectedId(agent.id)}>
                        <td className="py-4 pr-4">
                          <div>
                            <p className="font-semibold text-white">{agent.name}</p>
                            <p className="text-xs text-slate-500">{agent.id}</p>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-slate-300">{agent.role}</td>
                        <td className="py-4 pr-4 text-slate-300">{agent.currentTask}</td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-2.5 py-1 text-xs capitalize ${statusPill[agent.status] || statusPill.idle}`}>{agent.status}</span></td>
                        <td className="py-4 pr-4 text-slate-300">{agent.model}</td>
                        <td className="py-4 pr-4 text-slate-300">{agent.lastHeartbeat}</td>
                        <td className="py-4 pr-4 text-slate-300">{agent.tokenUsage?.toLocaleString?.() ?? agent.tokenUsage}</td>
                        <td className="py-4 text-slate-300">${agent.estimatedCost?.toFixed?.(2) ?? agent.estimatedCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ShellCard>

            <ShellCard title={selected ? `${selected.name} drill-down` : 'Agent drill-down'} eyebrow="Selected session" action={selected ? <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${statusPill[selected.status] || statusPill.idle}`}>{selected.status}</span> : null}>
              {selected ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm text-slate-400">Objective</p>
                    <p className="mt-1 text-sm text-white">{selected.objective}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-slate-500">Model</p>
                      <p className="mt-1 text-white">{selected.modelProvider} / {selected.model}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-slate-500">Transcript path</p>
                      <p className="mt-1 break-all text-white">{selected.transcriptPath || 'Unavailable'}</p>
                    </div>
                  </div>
                  {[
                    ['Recent logs', selected.recentLogs],
                    ['Tool calls', selected.toolCalls],
                    ['Outputs & artifacts', selected.outputs],
                    ['Errors / retries', selected.errors.length ? selected.errors : ['No active errors']],
                  ].map(([label, items]) => (
                    <div key={label}>
                      <p className="text-sm text-slate-400">{label}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {items.map((item) => (
                          <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No sessions available.</p>
              )}
            </ShellCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <ShellCard title="Task timeline / execution trace" eyebrow="Flow across agents" action={<Activity size={18} className="text-cyan-300" />}>
              <div className="space-y-4">
                {dashboard.timeline.map((item, index) => (
                  <div key={`${item.owner}-${item.step}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`mt-1 h-3.5 w-3.5 rounded-full ${item.status === 'done' ? 'bg-emerald-400' : item.status === 'active' ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                      {index < dashboard.timeline.length - 1 && <div className="mt-2 h-full w-px bg-white/10" />}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{item.step}</p>
                        <span className="text-xs text-slate-500">{item.time}</span>
                      </div>
                      <p className="text-sm text-slate-400">Owner: {item.owner}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard title="Human override panel" eyebrow="Intervention controls" action={<Shield size={18} className="text-violet-300" />}>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Pause agent', 'Resume agent', 'Cancel task', 'Retry task', 'Reassign task', 'Add human instruction'].map((label, i) => (
                  <button key={label} className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${i === 0 ? 'border-amber-400/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15' : i === 2 ? 'border-rose-400/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15' : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm text-slate-400">Operator note</p>
                <p className="mt-2 text-sm text-white">
                  This panel is UI-only for now. Next step: wire these actions to OpenClaw session controls, task queue routing, and approval workflows.
                </p>
              </div>
            </ShellCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <ShellCard title="Usage by agent" eyebrow="Cost observability" action={<Wallet size={18} className="text-cyan-300" />}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.usageByAgent}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} hide />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16 }} />
                    <Bar dataKey="cost" radius={[8, 8, 0, 0]} fill="#22d3ee" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ShellCard>

            <ShellCard title="Usage by model" eyebrow="Provider / model mix" action={<Bot size={18} className="text-violet-300" />}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboard.usageByModel}>
                    <defs>
                      <linearGradient id="costFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="model" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} hide />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16 }} />
                    <Area type="monotone" dataKey="cost" stroke="#a78bfa" fill="url(#costFill)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ShellCard>

            <ShellCard title="Reliability snapshot" eyebrow="Continuous evaluation" action={<CirclePause size={18} className="text-emerald-300" />}>
              <div className="grid gap-3">
                {dashboard.reliability.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </ShellCard>
          </section>
        </main>
      </div>
    </div>
  );
}
