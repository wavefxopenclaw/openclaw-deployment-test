export function ShellCard({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`rounded-[28px] border border-white/10 bg-white/[0.045] shadow-glow backdrop-blur-xl ${className}`}>
      {(title || eyebrow || action) && (
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div>
            {eyebrow && <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>}
            {title && <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function SidebarItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active ? 'border border-white/10 bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/30 p-6 text-center">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
    </div>
  );
}
