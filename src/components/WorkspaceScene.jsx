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
      title: 'OpenClaw HQ is in incident mode',
      subtitle: 'Warning lights are flashing and the fox is scrambling desk-to-desk to stabilize the mission floor.',
      pose: 'desk',
      energy: 'High alert',
      badge: 'Incident mode',
      accent: 'rose',
    };
  }

  if (running > 0) {
    return {
      mood: 'working',
      title: 'OpenClaw HQ is actively shipping',
      subtitle: 'The operations floor is lit up, monitors are buzzing, and the fox is focused at the command desk.',
      pose: 'desk',
      energy: 'Deep work',
      badge: `${running} active agent${running === 1 ? '' : 's'}`,
      accent: 'cyan',
    };
  }

  if (waiting > 0 || totalTasks > 0) {
    return {
      mood: 'planning',
      title: 'OpenClaw HQ is in planning mode',
      subtitle: 'Coffee is hot, notes are spread out, and the fox is preparing the next wave of tasks.',
      pose: 'lounge',
      energy: 'Ready',
      badge: `${waiting || totalTasks} queued item${waiting === 1 || totalTasks === 1 ? '' : 's'}`,
      accent: 'violet',
    };
  }

  return {
    mood: 'idle',
    title: 'OpenClaw HQ is in cozy idle mode',
    subtitle: 'The office is calm, the couch is occupied, and the fox is recharging until the next mission arrives.',
    pose: 'couch',
    energy: 'Idle',
    badge: 'All clear',
    accent: 'emerald',
  };
}

function PixelTile({ children, className = '' }) {
  return <div className={`border border-white/10 bg-white/[0.035] ${className}`}>{children}</div>;
}

function FoxSprite({ pose = 'desk' }) {
  return (
    <div className="relative h-20 w-16">
      <div className="absolute left-1/2 top-1 h-4 w-4 -translate-x-1/2 rotate-45 bg-orange-500" />
      <div className="absolute left-[18%] top-2 h-3 w-3 -rotate-12 bg-orange-600" />
      <div className="absolute right-[18%] top-2 rotate-12 h-3 w-3 bg-orange-600" />
      <div className="absolute left-1/2 top-3 h-8 w-8 -translate-x-1/2 rounded-sm border border-orange-100/20 bg-orange-300" />
      <div className="absolute left-1/2 top-8 h-8 w-10 -translate-x-1/2 rounded-sm border border-orange-100/20 bg-orange-400" />
      <div className="absolute left-[18%] top-10 h-6 w-2 rounded-sm bg-orange-300" />
      <div className="absolute right-[18%] top-10 h-6 w-2 rounded-sm bg-orange-300" />
      <div className="absolute left-[34%] top-[58px] h-6 w-2 rounded-sm bg-orange-300" />
      <div className="absolute right-[34%] top-[58px] h-6 w-2 rounded-sm bg-orange-300" />
      <div className="absolute left-1/2 top-6 h-3 w-5 -translate-x-1/2 rounded-sm bg-white/90" />
      {pose !== 'couch' && <div className="absolute -right-2 top-9 h-3 w-3 rounded-sm bg-cyan-300" />}
      {pose === 'couch' && <div className="absolute -right-2 top-9 h-3 w-3 rounded-sm bg-amber-300" />}
    </div>
  );
}

function WorkspacePixelScene({ pose = 'desk', accent = 'cyan' }) {
  const accentMap = {
    cyan: 'shadow-cyan-500/20',
    violet: 'shadow-violet-500/20',
    rose: 'shadow-rose-500/20',
    emerald: 'shadow-emerald-500/20',
  };

  return (
    <div className={`rounded-[32px] border border-white/10 bg-[#7f86bd]/15 p-3 shadow-2xl ${accentMap[accent] || accentMap.cyan}`}>
      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#9ea7d8]/25">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-100/80">OpenClaw HQ</div>
        </div>

        <div className="grid gap-0 md:hidden">
          <div className="grid grid-cols-6 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px] p-3">
            <PixelTile className="col-span-4 row-span-2 m-1 rounded-md p-2">
              <div className="grid h-full grid-cols-2 gap-2">
                <div className="rounded-md border border-white/10 bg-[#727ac0]/45 p-2">
                  <div className="mb-2 h-2 w-12 rounded bg-cyan-200/70" />
                  <div className="flex justify-center">
                    <FoxSprite pose={pose === 'couch' ? 'desk' : pose} />
                  </div>
                </div>
                <div className="rounded-md border border-white/10 bg-[#727ac0]/45 p-2">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-2 w-10 rounded bg-violet-200/70" />
                    <LampDesk size={14} className="text-amber-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2">
                    <div className="h-7 rounded-sm bg-slate-900/30" />
                    <div className="h-7 rounded-sm bg-slate-900/30" />
                    <div className="h-7 rounded-sm bg-slate-900/30" />
                    <div className="h-7 rounded-sm bg-slate-900/30" />
                  </div>
                </div>
                <div className="col-span-2 rounded-md border border-white/10 bg-[#6a72b7]/50 p-2">
                  <div className="mb-2 flex items-center justify-between text-slate-100/80">
                    <MoonStar size={13} />
                    <Sparkles size={13} />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-5 rounded-sm bg-slate-900/25" />
                    ))}
                  </div>
                </div>
              </div>
            </PixelTile>

            <PixelTile className="col-span-2 m-1 rounded-md p-2">
              <div className="flex h-full flex-col items-center justify-center rounded-md bg-[#c7b793]/35 p-2 text-center">
                {pose === 'couch' ? <Armchair size={20} className="text-slate-100/80" /> : <BriefcaseBusiness size={20} className="text-slate-100/80" />}
                <div className="mt-2 text-[10px] uppercase tracking-wide text-slate-100/80">
                  {pose === 'couch' ? 'Lounge' : 'Ops desk'}
                </div>
              </div>
            </PixelTile>

            <PixelTile className="col-span-6 m-1 rounded-md p-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-[#7a82c4]/45 p-2 text-center">
                  <Coffee size={16} className="mx-auto text-amber-200" />
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-100/80">Cafe</div>
                </div>
                <div className="rounded-md bg-[#7a82c4]/45 p-2 text-center">
                  <Bot size={16} className="mx-auto text-cyan-200" />
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-100/80">Agent bay</div>
                </div>
                <div className="rounded-md bg-[#7a82c4]/45 p-2 text-center">
                  <Sparkles size={16} className="mx-auto text-violet-200" />
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-100/80">Decor</div>
                </div>
              </div>
            </PixelTile>
          </div>
        </div>

        <div className="hidden md:block bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] p-4">
          <div className="grid grid-cols-12 gap-2">
            <PixelTile className="col-span-7 rounded-md p-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-[#727ac0]/45 p-2">
                  <div className="mb-2 h-2 w-14 rounded bg-cyan-200/70" />
                  <div className="flex justify-center"><FoxSprite pose={pose === 'couch' ? 'desk' : pose} /></div>
                </div>
                <div className="rounded-md bg-[#727ac0]/45 p-2">
                  <div className="mb-2 flex items-center justify-between"><div className="h-2 w-10 rounded bg-violet-200/70" /><LampDesk size={14} className="text-amber-200" /></div>
                  <div className="grid grid-cols-2 gap-1 pt-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-8 rounded-sm bg-slate-900/30" />)}</div>
                </div>
                <div className="rounded-md bg-[#727ac0]/45 p-2">
                  <div className="mb-2 h-2 w-10 rounded bg-cyan-200/70" />
                  <div className="flex justify-center"><FoxSprite pose="desk" /></div>
                </div>
              </div>
            </PixelTile>
            <PixelTile className="col-span-5 rounded-md p-3">
              <div className="grid h-full grid-cols-2 gap-2">
                <div className="rounded-md bg-[#c7b793]/35 p-3 text-center"><Coffee size={18} className="mx-auto text-amber-200" /><div className="mt-2 text-[10px] uppercase tracking-wide text-slate-100/80">Cafe bar</div></div>
                <div className="rounded-md bg-[#7a82c4]/45 p-3 text-center"><Sparkles size={18} className="mx-auto text-violet-200" /><div className="mt-2 text-[10px] uppercase tracking-wide text-slate-100/80">Decor wall</div></div>
                <div className="col-span-2 rounded-md bg-[#6a72b7]/50 p-3 text-center">{pose === 'couch' ? <Armchair size={20} className="mx-auto text-slate-100/80" /> : <BriefcaseBusiness size={20} className="mx-auto text-slate-100/80" />}<div className="mt-2 text-[10px] uppercase tracking-wide text-slate-100/80">{pose === 'couch' ? 'Lounge corner' : 'Command desk'}</div></div>
              </div>
            </PixelTile>
          </div>
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
          <WorkspacePixelScene pose={scene.pose} accent={scene.accent} />
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
