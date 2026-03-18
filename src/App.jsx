import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bot,
  Gauge,
  Layers3,
  Menu,
  RefreshCcw,
  Shield,
  Sparkles,
  SquareTerminal,
  Waves,
  X,
  Zap,
} from 'lucide-react';
import { api, API_BASE } from './api';
import { KanbanBoard } from './components/KanbanBoard';
import { LiveActivityPanel } from './components/LiveActivityPanel';
import { MetricsStrip } from './components/MetricsStrip';
import { EmptyState, ShellCard, SidebarItem } from './components/ui';
import { WorkspaceScene } from './components/WorkspaceScene';

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

function timeAgoFromTimestamp(value) {
  if (!value) return 'now';
  const delta = Date.now() - Number(value);
  if (delta < 60_000) return `${Math.max(1, Math.round(delta / 1000))}s ago`;
  if (delta < 3_600_000) return `${Math.round(delta / 60_000)}m ago`;
  if (delta < 86_400_000) return `${Math.round(delta / 3_600_000)}h ago`;
  return `${Math.round(delta / 86_400_000)}d ago`;
}

function normalizeTask(task) {
  const rawStatus = (task.status || '').toLowerCase();
  const title = task.title || 'Untitled task';
  let column = 'backlog';
  let statusLabel = 'Queued';

  if (rawStatus === 'running') {
    column = 'inprogress';
    statusLabel = 'Running';
  } else if (rawStatus === 'waiting' || rawStatus === 'blocked') {
    column = 'review';
    statusLabel = rawStatus === 'blocked' ? 'Blocked' : 'Awaiting review';
  } else if (rawStatus === 'failed') {
    column = 'review';
    statusLabel = 'Failed';
  }

  const lowered = `${title} ${task.agentName || ''}`.toLowerCase();
  const priority = rawStatus === 'failed' || lowered.includes('deploy') || lowered.includes('alert') ? 'high' : rawStatus === 'running' ? 'medium' : 'low';

  return {
    ...task,
    title,
    column,
    priority,
    statusLabel,
    timeLabel: timeAgoFromTimestamp(task.updatedAt),
  };
}

export default function App() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  async function loadDashboard() {
    try {
      if (!dashboard.generatedAt) setLoading(true);
      const json = await api.dashboard();
      setDashboard(json);
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

  const normalizedTasks = useMemo(() => dashboard.tasks.map(normalizeTask), [dashboard.tasks]);
  const columns = useMemo(
    () => [
      {
        key: 'backlog',
        label: 'Backlog',
        description: 'Queued and idle work',
        items: normalizedTasks.filter((task) => task.column === 'backlog'),
      },
      {
        key: 'inprogress',
        label: 'In Progress',
        description: 'Actively executing tasks',
        items: normalizedTasks.filter((task) => task.column === 'inprogress'),
      },
      {
        key: 'review',
        label: 'Review',
        description: 'Waiting, blocked, or failed',
        items: normalizedTasks.filter((task) => task.column === 'review'),
      },
    ],
    [normalizedTasks]
  );

  const tasksThisWeek = dashboard.tasks.length;
  const tasksInProgress = columns.find((column) => column.key === 'inprogress')?.items.length || 0;
  const completedCount = dashboard.summary.find((item) => item.label === 'Completed tasks')?.value || 0;
  const completionPct = typeof completedCount === 'number' && tasksThisWeek > 0 ? `${Math.min(100, Math.round((completedCount / tasksThisWeek) * 100))}%` : '0%';

  const metrics = [
    { label: 'Tasks this week', value: tasksThisWeek, detail: 'Session-derived workload' },
    { label: 'Tasks in progress', value: tasksInProgress, detail: 'Active mission threads' },
    { label: 'Total tasks', value: normalizedTasks.length, detail: 'Pulled from /api/tasks' },
    { label: 'Completion %', value: completionPct, detail: 'Operational throughput' },
  ];

  const gatewayReachable = dashboard.status?.gateway?.reachable;
  const warningCount = dashboard.status?.securityAudit?.summary?.warn ?? 0;

  const navItems = [
    { key: 'overview', label: 'Command Overview', icon: Gauge },
    { key: 'workspace', label: 'Workspace', icon: Bot },
    { key: 'queue', label: 'Mission Queue', icon: Layers3 },
    { key: 'execution', label: 'Execution Trace', icon: SquareTerminal },
    { key: 'guardrails', label: 'Guardrails', icon: Shield },
  ];

  function selectTab(key) {
    setActiveTab(key);
    setMenuOpen(false);
  }

  const overviewContent = (
    <>
      <MetricsStrip metrics={metrics} />

      {loading && !normalizedTasks.length ? (
        <ShellCard title="Mission queue" eyebrow="Kanban command board" className="border-cyan-400/10 bg-slate-900/65">
          <EmptyState title="Loading real mission data" body="Waiting for the OpenClaw API to return tasks and fleet telemetry." />
        </ShellCard>
      ) : (
        <KanbanBoard columns={columns} />
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <ShellCard title="Alerts and incidents" eyebrow="Operational trust" action={<Sparkles size={16} className="text-violet-300" />} className="border-violet-400/10 bg-slate-900/65">
          <div className="space-y-3">
            {dashboard.alerts.length ? (
              dashboard.alerts.map((alert, index) => (
                <div key={`${alert.title}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{alert.title}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide ${alert.severity === 'critical' ? 'bg-rose-500/15 text-rose-300' : alert.severity === 'warning' ? 'bg-amber-500/15 text-amber-300' : 'bg-cyan-500/15 text-cyan-300'}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{alert.detail}</p>
                </div>
              ))
            ) : (
              <EmptyState title="No active alerts" body="The API returned a clean alert state." />
            )}
          </div>
        </ShellCard>

        <ShellCard title="Agent roster" eyebrow="Realtime observability" action={<Activity size={16} className="text-cyan-300" />} className="border-cyan-400/10 bg-slate-900/65">
          <div className="space-y-3">
            {dashboard.agents.length ? (
              dashboard.agents.map((agent) => (
                <div key={agent.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{agent.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{agent.modelProvider} / {agent.model}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${agent.status === 'running' ? 'bg-cyan-500/15 text-cyan-300' : agent.status === 'waiting' ? 'bg-violet-500/15 text-violet-300' : agent.status === 'failed' ? 'bg-rose-500/15 text-rose-300' : 'bg-slate-500/15 text-slate-300'}`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{agent.currentTask}</p>
                </div>
              ))
            ) : (
              <EmptyState title="No agents found" body="The API did not return any agent sessions." />
            )}
          </div>
        </ShellCard>
      </div>
    </>
  );

  const placeholderPage = (title, body) => (
    <ShellCard title={title} eyebrow="Coming online" className="border-cyan-400/10 bg-slate-900/65">
      <EmptyState title={title} body={body} />
    </ShellCard>
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.13),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_32%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.08),transparent_28%),linear-gradient(to_bottom,rgba(3,7,18,0.96),rgba(2,6,23,1))]" />
      <div className="pointer-events-none fixed inset-0 bg-grid bg-[size:22px_22px] opacity-[0.05]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-400/10 to-transparent blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1820px] gap-5 p-4 lg:p-6">
        <aside className="hidden w-72 shrink-0 rounded-[30px] border border-cyan-400/10 bg-slate-900/70 p-5 shadow-glow backdrop-blur-2xl xl:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-violet-500 text-slate-950 shadow-lg shadow-cyan-500/20">
              <Waves size={22} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">OpenClaw</p>
              <h1 className="text-lg font-semibold text-white">Mission Control</h1>
            </div>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <button key={item.key} onClick={() => selectTab(item.key)} className="w-full">
                <SidebarItem icon={item.icon} label={item.label} active={activeTab === item.key} />
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/10 via-white/[0.02] to-violet-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Mission brief</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Fleet-level visibility, cinematic telemetry, and operator control over every OpenClaw workflow.
            </p>
          </div>

          <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
            <div className="flex items-center justify-between gap-3">
              <span>API source</span>
              <span className="truncate text-right text-xs text-slate-500">{API_BASE || 'same-origin /api'}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Gateway</span>
              <span className={`${gatewayReachable ? 'text-emerald-300' : 'text-rose-300'}`}>{gatewayReachable ? 'Online' : 'Offline'}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Warnings</span>
              <span className="text-amber-300">{warningCount}</span>
            </div>
          </div>
        </aside>

        <main className="grid min-w-0 flex-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <ShellCard className="overflow-hidden border-cyan-400/10 bg-slate-900/65">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <button
                    onClick={() => setMenuOpen((value) => !value)}
                    className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 transition hover:bg-white/[0.08] xl:hidden"
                    aria-label="Open navigation"
                  >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                      <Zap size={12} /> Mission Control Active
                    </div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                      {activeTab === 'workspace'
                        ? 'Workspace view for your OpenClaw operator.'
                        : 'Real-time operator view for AI missions, agents, and runtime health.'}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 lg:text-[15px]">
                      {activeTab === 'workspace'
                        ? 'A gamified office scene where the fox reacts to live fleet state — lounging when idle, focused at the desk when work is flowing, and scrambling when incidents appear.'
                        : 'Inspired by a modern mission-control control plane: dark, glassy, high-signal, and built around live orchestration instead of a generic admin dashboard.'}
                    </p>
                  </div>
                </div>
                <div className="hidden grid gap-3 sm:grid-cols-2 md:grid">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-sm">
                    <p className="text-slate-500">Last sync</p>
                    <p className="mt-1 font-medium text-white">{dashboard.generatedAt ? new Date(dashboard.generatedAt).toLocaleTimeString() : 'Loading...'}</p>
                  </div>
                  <button onClick={loadDashboard} className="inline-flex items-center justify-center gap-2 rounded-3xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-4 text-sm text-cyan-100 transition hover:bg-cyan-400/15">
                    <RefreshCcw size={16} /> Sync now
                  </button>
                </div>
              </div>

              {menuOpen && (
                <div className="mt-5 grid gap-2 xl:hidden">
                  {navItems.map((item) => (
                    <button key={item.key} onClick={() => selectTab(item.key)} className="w-full">
                      <SidebarItem icon={item.icon} label={item.label} active={activeTab === item.key} />
                    </button>
                  ))}
                  <div className="grid gap-3 pt-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-sm">
                      <p className="text-slate-500">Last sync</p>
                      <p className="mt-1 font-medium text-white">{dashboard.generatedAt ? new Date(dashboard.generatedAt).toLocaleTimeString() : 'Loading...'}</p>
                    </div>
                    <button onClick={loadDashboard} className="inline-flex items-center justify-center gap-2 rounded-3xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-4 text-sm text-cyan-100 transition hover:bg-cyan-400/15">
                      <RefreshCcw size={16} /> Sync now
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="mt-4 text-sm text-rose-300">API error: {error}</p>}
            </ShellCard>

            {activeTab === 'overview' && overviewContent}
            {activeTab === 'workspace' && <WorkspaceScene agents={dashboard.agents} tasks={normalizedTasks} />}
            {activeTab === 'queue' && <KanbanBoard columns={columns} />}
            {activeTab === 'execution' && placeholderPage('Execution Trace', 'A dedicated execution-trace page can live here next, with step-by-step task flow and tool-call playback.')}
            {activeTab === 'guardrails' && placeholderPage('Guardrails', 'This tab can become a policy, alerts, and intervention center with operator controls and incident history.')}
          </div>

          <div className="min-w-0 self-start xl:block" hidden={activeTab === 'workspace' ? false : false}>
            <LiveActivityPanel feed={dashboard.feed} agents={dashboard.agents} />
          </div>
        </main>
      </div>
    </div>
  );
}
