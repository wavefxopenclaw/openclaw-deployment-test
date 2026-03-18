import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CirclePause,
  Gauge,
  Shield,
  SquareTerminal,
  Wallet,
  Waves,
} from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { agents, alerts, feed, modelUsage, reliability, summary, timeline, usage } from './data';

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
  const selected = agents[0];

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
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Control plane thesis</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Real-time visibility, operational trust, and human override for every agent decision.
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
                  Observe live execution, inspect traces, track spend, and intervene before agent behavior turns into operational risk.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['System health', 'Nominal'],
                  ['Guardrails', 'Active'],
                  ['Incidents', '1 critical'],
                  ['Operator mode', 'Supervised'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {summary.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
                <div className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${toneMap[item.tone]}`}>
                  {item.label}
                </div>
                <div className="mt-5 text-3xl font-semibold text-white">{item.value}</div>
                <p className="mt-2 text-sm text-slate-400">{item.delta}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
            <ShellCard title="Live fleet activity" eyebrow="Event stream" action={<button className="text-sm text-cyan-300">View all</button>}>
              <div className="space-y-3">
                {feed.map((item) => (
                  <div key={`${item.time}-${item.agent}`} className="flex items-start gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                    <div className={`mt-1 h-2.5 w-2.5 rounded-full ${item.tone === 'danger' ? 'bg-rose-400' : item.tone === 'warning' ? 'bg-amber-400' : item.tone === 'success' ? 'bg-emerald-400' : item.tone === 'cyan' ? 'bg-cyan-400' : 'bg-slate-500'}`} />
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
                {alerts.map((alert) => (
                  <div key={alert.title} className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
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
            <ShellCard title="Agent fleet" eyebrow="Realtime roster" action={<button className="inline-flex items-center gap-2 text-sm text-cyan-300">Inspect all <ArrowRight size={16} /></button>}>
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
                    {agents.map((agent) => (
                      <tr key={agent.id} className="border-b border-white/5 last:border-0">
                        <td className="py-4 pr-4">
                          <div>
                            <p className="font-semibold text-white">{agent.name}</p>
                            <p className="text-xs text-slate-500">{agent.id}</p>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-slate-300">{agent.role}</td>
                        <td className="py-4 pr-4 text-slate-300">{agent.task}</td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-2.5 py-1 text-xs capitalize ${statusPill[agent.status]}`}>{agent.status}</span></td>
                        <td className="py-4 pr-4 text-slate-300">{agent.model}</td>
                        <td className="py-4 pr-4 text-slate-300">{agent.heartbeat}</td>
                        <td className="py-4 pr-4 text-slate-300">{agent.tokens}</td>
                        <td className="py-4 text-slate-300">{agent.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ShellCard>

            <ShellCard title={`${selected.name} drill-down`} eyebrow="Selected agent" action={<span className={`rounded-full px-2.5 py-1 text-xs capitalize ${statusPill[selected.status]}`}>{selected.status}</span>}>
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-400">Objective</p>
                  <p className="mt-1 text-sm text-white">{selected.objective}</p>
                </div>
                {[
                  ['Recent logs', selected.logs],
                  ['Tool calls', selected.tools],
                  ['File changes', selected.files],
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
            </ShellCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <ShellCard title="Task timeline / execution trace" eyebrow="Flow across agents" action={<Activity size={18} className="text-cyan-300" />}>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`mt-1 h-3.5 w-3.5 rounded-full ${item.status === 'done' ? 'bg-emerald-400' : item.status === 'active' ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                      {index < timeline.length - 1 && <div className="mt-2 h-full w-px bg-white/10" />}
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
                  “Pause any deploy if spend exceeds threshold, collect logs, then ask for human approval before retrying.”
                </p>
              </div>
            </ShellCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <ShellCard title="Usage by agent" eyebrow="Cost observability" action={<Wallet size={18} className="text-cyan-300" />}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usage}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
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
                  <AreaChart data={modelUsage}>
                    <defs>
                      <linearGradient id="costFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="model" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16 }} />
                    <Area type="monotone" dataKey="cost" stroke="#a78bfa" fill="url(#costFill)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ShellCard>

            <ShellCard title="Reliability snapshot" eyebrow="Continuous evaluation" action={<CirclePause size={18} className="text-emerald-300" />}>
              <div className="grid gap-3">
                {reliability.map((item) => (
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
