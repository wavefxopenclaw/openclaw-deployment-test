import { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  Gauge,
  Layers3,
  RefreshCcw,
  Shield,
  Sparkles,
  SquareTerminal,
  Waves,
} from 'lucide-react';
import { api, API_BASE } from './api';
import { KanbanBoard } from './components/KanbanBoard';
import { LiveActivityPanel } from './components/LiveActivityPanel';
import { MetricsStrip } from './components/MetricsStrip';
import { EmptyState, ShellCard, SidebarItem } from './components/ui';

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
  const columns = useMemo(() => [
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
  ], [normalizedTasks]);

  const tasksThisWeek = dashboard.tasks.length;
  const tasksInProgress = columns.find((column) => column.key === 'inprogress')?.items.length || 0;
  const completedCount = dashboard.summary.find((item) => item.label === 'Completed tasks')?.value || 0;
  const completionPct = typeof completedCount === 'number' && tasksThisWeek > 0 ? `${Math.min(100, Math.round((completedCount / tasksThisWeek) * 100))}%` : '0%';

  const metrics = [
    { label: 'Tasks this week', value: tasksThisWeek, detail: 'Session-derived workload this week' },
    { label: 'Tasks in progress', value: tasksInProgress, detail: 'Currently active work across agents' },
    { label: 'Total tasks', value: normalizedTasks.length, detail: 'Pulled from /api/tasks' },
    { label: 'Completion %', value: completionPct, detail: 'Based on current dashboard totals' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_right,rgba(124,58,237,0.14),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.84),rgba(2,6,23,1))]" />
      <div className="pointer-events-none fixed inset-0 bg-grid bg-[size:24px_24px] opacity-[0.05]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1760px] gap-5 p-4 lg:p-6">
        <aside className="hidden w-72 shrink-0 rounded-[30px] border border-white/10 bg-slate-900/75 p-5 shadow-glow backdrop-blur-xl xl:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20">
              <Waves size={22} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">OpenClaw</p>
              <h1 className="text-lg font-semibold text-white">Mission Control</h1>
            </div>
          </div>

          <div className="space-y-2">
            <SidebarItem icon={Gauge} label="Overview" active />
            <SidebarItem icon={Layers3} label="Kanban Queue" />
            <SidebarItem icon={Bot} label="Agent Fleet" />
            <SidebarItem icon={SquareTerminal} label="Execution" />
            <SidebarItem icon={Shield} label="Guardrails" />
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/10 to-violet-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Operations brief</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Cinematic AI operations console with real OpenClaw data, mission queue visibility, and live observability.
            </p>
          </div>

          <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
            <div className="flex items-center justify-between gap-3">
              <span>API source</span>
              <span className="truncate text-right text-xs text-slate-500">{API_BASE || 'same-origin /api'}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Gateway</span>
              <span className={`${dashboard.status?.gateway?.reachable ? 'text-emerald-300' : 'text-rose-300'}`}>{dashboard.status?.gateway?.reachable ? 'Reachable' : 'Unavailable'}</span>
            </div>
          </div>
        </aside>

        <main className="grid min-w-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5 min-w-0">
            <ShellCard className="overflow-hidden">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">AI operations center</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">Fleet command with real-time Kanban orchestration</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                    Observe agents, track mission flow, and inspect live operational behavior through a glassy control plane built on your OpenClaw API.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right text-sm">
                    <p className="text-slate-500">Last sync</p>
                    <p className="mt-1 font-medium text-white">{dashboard.generatedAt ? new Date(dashboard.generatedAt).toLocaleTimeString() : 'Loading...'}</p>
                  </div>
                  <button onClick={loadDashboard} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.1]">
                    <RefreshCcw size={16} /> Refresh
                  </button>
                </div>
              </div>
              {error && <p className="mt-4 text-sm text-rose-300">API error: {error}</p>}
            </ShellCard>

            <MetricsStrip metrics={metrics} />

            {loading && !normalizedTasks.length ? (
              <ShellCard title="Mission queue" eyebrow="Kanban control plane">
                <EmptyState title="Loading real task data" body="Waiting for /api/dashboard and /api/tasks to return your OpenClaw workload." />
              </ShellCard>
            ) : (
              <KanbanBoard columns={columns} />
            )}

            <div className="grid gap-5 lg:grid-cols-2">
              <ShellCard title="Alerts" eyebrow="Trust and safety" action={<Sparkles size={16} className="text-violet-300" />}>
                <div className="space-y-3">
                  {dashboard.alerts.length ? dashboard.alerts.map((alert, index) => (
                    <div key={`${alert.title}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">{alert.title}</p>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide ${alert.severity === 'critical' ? 'bg-rose-500/15 text-rose-300' : alert.severity === 'warning' ? 'bg-amber-500/15 text-amber-300' : 'bg-cyan-500/15 text-cyan-300'}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{alert.detail}</p>
                    </div>
                  )) : <EmptyState title="No active alerts" body="The API returned a clean alert state." />}
                </div>
              </ShellCard>

              <ShellCard title="Agent roster" eyebrow="Realtime observability">
                <div className="space-y-3">
                  {dashboard.agents.length ? dashboard.agents.map((agent) => (
                    <div key={agent.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">{agent.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{agent.modelProvider} / {agent.model}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${agent.status === 'running' ? 'bg-cyan-500/15 text-cyan-300' : agent.status === 'waiting' ? 'bg-violet-500/15 text-violet-300' : agent.status === 'failed' ? 'bg-rose-500/15 text-rose-300' : 'bg-slate-500/15 text-slate-300'}`}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300">{agent.currentTask}</p>
                    </div>
                  )) : <EmptyState title="No agents found" body="The API did not return any agent sessions." />}
                </div>
              </ShellCard>
            </div>
          </div>

          <div className="min-w-0">
            <LiveActivityPanel feed={dashboard.feed} agents={dashboard.agents} />
          </div>
        </main>
      </div>
    </div>
  );
}
