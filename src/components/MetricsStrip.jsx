import { CheckCircle2, CircleDot, ClipboardList, Sparkles } from 'lucide-react';
import { ShellCard } from './ui';

const icons = [ClipboardList, CircleDot, CheckCircle2, Sparkles];

export function MetricsStrip({ metrics }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = icons[index] || Sparkles;
        return (
          <ShellCard key={metric.label} className="overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-500">{metric.detail}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
                <Icon size={18} />
              </div>
            </div>
          </ShellCard>
        );
      })}
    </div>
  );
}
