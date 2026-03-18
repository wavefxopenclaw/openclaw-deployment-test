import { AlertTriangle, ArrowUp, CircleDot, Clock3 } from 'lucide-react';
import { EmptyState, ShellCard } from './ui';

const priorityTone = {
  high: 'bg-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.35)]',
  medium: 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)]',
  low: 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]',
};

const statusTone = {
  backlog: 'text-slate-300',
  inprogress: 'text-cyan-300',
  review: 'text-violet-300',
};

function TaskCard({ task }) {
  const PriorityIcon = task.priority === 'high' ? AlertTriangle : task.priority === 'medium' ? Clock3 : ArrowUp;
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.045] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-white/[0.075]">
      <div className="flex items-start justify-between gap-3">
        <div className={`h-2.5 w-2.5 rounded-full ${priorityTone[task.priority] || priorityTone.low}`} />
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] uppercase tracking-wide text-slate-400">
          <PriorityIcon size={12} /> {task.priority}
        </span>
      </div>
      <h4 className="mt-4 text-sm font-semibold leading-6 text-white">{task.title}</h4>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
        <span className="truncate">{task.agentName}</span>
        <span>{task.timeLabel}</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-1 text-xs ${statusTone[task.column] || 'text-slate-300'}`}>
          <CircleDot size={12} /> {task.statusLabel}
        </span>
        <span className="truncate text-[11px] uppercase tracking-wide text-slate-500">{task.model}</span>
      </div>
    </div>
  );
}

export function KanbanBoard({ columns }) {
  return (
    <ShellCard title="Mission queue" eyebrow="Central command board" action={<span className="text-sm text-slate-500">Live task grouping</span>} className="h-full border-cyan-400/10 bg-slate-900/65">
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <div key={column.key} className="rounded-[28px] border border-white/8 bg-black/20 p-4 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{column.label}</p>
                <p className="text-xs text-slate-500">{column.description}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">{column.items.length}</span>
            </div>
            <div className="space-y-3">
              {column.items.length ? (
                column.items.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <EmptyState title={`No ${column.label.toLowerCase()} tasks`} body="This lane is clear right now." />
              )}
            </div>
          </div>
        ))}
      </div>
    </ShellCard>
  );
}
