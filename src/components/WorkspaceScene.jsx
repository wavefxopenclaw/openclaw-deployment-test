import { Armchair, Bot, BriefcaseBusiness, Coffee, LampDesk, MoonStar, Sparkles } from 'lucide-react';
import { EmptyState, ShellCard } from './ui';

function deriveWorkspaceState(agents = [], tasks = []) {
  const running = agents.filter((agent) => agent.status === 'running').length;
  const waiting = agents.filter((agent) => agent.status === 'waiting').length;
  const failed = agents.filter((agent) => agent.status === 'failed').length;
  const totalTasks = tasks.length;

  if (failed > 0) {
    return {
      mood: 'alert',
      title: 'OpenClaw is handling a messy desk day',
      subtitle: 'Something needs attention. Papers are everywhere, warning lights are on, and the fox is triaging issues fast.',
      pose: 'desk',
      energy: 'High alert',
      badge: 'Incident mode',
      accent: 'rose',
    };
  }

  if (running > 0) {
    return {
      mood: 'working',
      title: 'OpenClaw is focused at the mission desk',
      subtitle: 'The control room is alive: screens glowing, tasks flowing, and the fox is actively shipping work.',
      pose: 'desk',
      energy: 'Deep work',
      badge: `${running} active agent${running === 1 ? '' : 's'}`,
      accent: 'cyan',
    };
  }

  if (waiting > 0 || totalTasks > 0) {
    return {
      mood: 'planning',
      title: 'OpenClaw is planning the next move',
      subtitle: 'A calm in-between state — reviewing notes, sipping coffee, and waiting for the next mission cue.',
      pose: 'lounge',
      energy: 'Ready',
      badge: `${waiting || totalTasks} queued item${waiting === 1 || totalTasks === 1 ? '' : 's'}`,
      accent: 'violet',
    };
  }

  return {
    mood: 'idle',
    title: 'OpenClaw is relaxing in the office lounge',
    subtitle: 'No active work right now. The mission room is quiet and the fox is recharging on the couch.',
    pose: 'couch',
    energy: 'Idle',
    badge: 'All clear',
    accent: 'emerald',
  };
}

function SceneArt({ pose = 'desk', accent = 'cyan' }) {
  const accentMap = {
    cyan: 'from-cyan-400/30 to-sky-500/10',
    violet: 'from-violet-400/30 to-fuchsia-500/10',
    rose: 'from-rose-400/30 to-orange-500/10',
    emerald: 'from-emerald-400/30 to-cyan-500/10',
  };

  return (
    <div className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br ${accentMap[accent] || accentMap.cyan} p-6`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%)]" />
      <div className="relative mx-auto h-[320px] max-w-[560px]">
        <div className="absolute inset-x-10 bottom-0 h-4 rounded-full bg-black/30 blur-xl" />

        <div className="absolute inset-x-6 bottom-4 h-28 rounded-[28px] border border-white/10 bg-slate-950/70" />
        <div className="absolute left-10 top-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-slate-100">
          <MoonStar size={26} />
        </div>
        <div className="absolute right-10 top-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-amber-200">
          <Sparkles size={20} />
        </div>

        {pose !== 'couch' && (
          <>
            <div className="absolute left-1/2 top-28 h-24 w-48 -translate-x-1/2 rounded-[24px] border border-cyan-300/20 bg-slate-900/80" />
            <div className="absolute left-1/2 top-20 h-12 w-28 -translate-x-1/2 rounded-2xl border border-cyan-300/20 bg-cyan-400/10" />
            <div className="absolute left-[18%] top-36 h-16 w-10 rounded-xl bg-slate-800" />
            <div className="absolute left-[18%] top-30 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-amber-200">
              <LampDesk size={20} />
            </div>
          </>
        )}

        {pose === 'couch' && (
          <>
            <div className="absolute left-1/2 top-36 h-24 w-56 -translate-x-1/2 rounded-[28px] border border-white/10 bg-violet-400/10" />
            <div className="absolute left-[28%] top-44 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-slate-100">
              <Armchair size={20} />
            </div>
            <div className="absolute right-[24%] top-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-amber-200">
              <Coffee size={20} />
            </div>
          </>
        )}

        <div className="absolute left-1/2 top-24 h-40 w-28 -translate-x-1/2">
          <div className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full border border-orange-200/30 bg-orange-300/90" />
          <div className="absolute left-1/2 top-12 h-24 w-20 -translate-x-1/2 rounded-[30px] border border-orange-200/20 bg-orange-400/80" />
          <div className="absolute left-[18%] top-24 h-10 w-6 rounded-full bg-orange-300/90" />
          <div className="absolute right-[18%] top-24 h-10 w-6 rounded-full bg-orange-300/90" />
          <div className="absolute left-[28%] top-[134px] h-12 w-5 rounded-full bg-orange-300/90" />
          <div className="absolute right-[28%] top-[134px] h-12 w-5 rounded-full bg-orange-300/90" />
          <div className="absolute left-[53%] top-6 h-5 w-7 rounded-full border border-orange-100/40 bg-white/60" />
          <div className="absolute left-[24%] top-4 h-5 w-4 -rotate-12 rounded-t-full bg-orange-500" />
          <div className="absolute right-[24%] top-4 h-5 w-4 rotate-12 rounded-t-full bg-orange-500" />
          <div className="absolute left-1/2 top-[58px] h-10 w-16 -translate-x-1/2 rounded-full bg-white/85" />
          {pose === 'desk' && (
            <div className="absolute right-[-18px] top-[82px] flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
              <BriefcaseBusiness size={18} />
            </div>
          )}
          {pose === 'lounge' && (
            <div className="absolute right-[-18px] top-[82px] flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-amber-200">
              <Coffee size={18} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WorkspaceScene({ agents = [], tasks = [] }) {
  const scene = deriveWorkspaceState(agents, tasks);
  const failed = agents.filter((agent) => agent.status === 'failed').length;
  const running = agents.filter((agent) => agent.status === 'running').length;
  const idle = agents.filter((agent) => agent.status === 'idle').length;

  return (
    <div className="space-y-5">
      <ShellCard title="Workspace" eyebrow="Gamified office view" action={<span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">{scene.badge}</span>} className="border-cyan-400/10 bg-slate-900/65">
        <div className="space-y-5">
          <SceneArt pose={scene.pose} accent={scene.accent} />
          <div>
            <h3 className="text-xl font-semibold text-white">{scene.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">{scene.subtitle}</p>
          </div>
        </div>
      </ShellCard>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Active fox mode', value: scene.energy, icon: Bot },
          { label: 'Running agents', value: String(running), icon: BriefcaseBusiness },
          { label: 'Idle agents', value: String(idle), icon: Armchair },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <ShellCard key={item.label} className="border-white/10 bg-slate-900/60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-cyan-300">
                  <Icon size={18} />
                </div>
              </div>
            </ShellCard>
          );
        })}
      </div>

      <ShellCard title="Office progression" eyebrow="Workspace game loop" className="border-violet-400/10 bg-slate-900/65">
        {tasks.length ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">Workspace XP</p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500" style={{ width: `${Math.min(100, 20 + tasks.length * 8)}%` }} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-slate-400">Completed vibe</p>
                <p className="mt-2 text-lg font-semibold text-white">Desk gets brighter as work clears</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-slate-400">Alert state</p>
                <p className="mt-2 text-lg font-semibold text-white">{failed > 0 ? 'Messy emergency mode' : 'Calm workspace'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-slate-400">Queue energy</p>
                <p className="mt-2 text-lg font-semibold text-white">{tasks.length} mission card{tasks.length === 1 ? '' : 's'} in play</p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="No workspace progress yet" body="Once tasks show up, the office scene will react to your fleet activity." />
        )}
      </ShellCard>
    </div>
  );
}
