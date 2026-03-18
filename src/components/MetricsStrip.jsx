import { CheckCircle2, CircleDot, ClipboardList, Sparkles } from 'lucide-react';
import { ShellCard } from './ui';

const icons = [ClipboardList, CircleDot, CheckCircle2, Sparkles];

export function MetricsStrip({ metrics }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = icons[index] || Sparkles;
        return (
          <ShellCard key={metric.label} className="overflow-hidden border-cyan-400/10 bg-slate-900/65">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-500">{metric.detail}</p>
              </div>
              <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/10 p-3 text-cyan-300 shadow-lg shadow-cyan-500/10">
                <Icon size={18} />
              </div>
            </div>
          </ShellCard>
        );
      })}
    </div>
  );
}
