import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  detail: string;
  icon: ReactNode;
  accent?: string;
  progress?: number;
  footer?: ReactNode;
  className?: string;
}

export function KpiCard({ label, value, detail, icon, accent = "from-indigo-400 to-violet-500", progress, footer, className }: KpiCardProps) {
  const safeProgress = progress === undefined ? null : Math.min(100, Math.max(0, progress));

  return (
    <article className={cn("group relative min-h-[172px] overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/65 p-5 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-zinc-900/80", className)}>
      <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r", accent)} />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.025] transition-transform duration-500 group-hover:scale-125" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
          <div className="mt-3 text-[2.25rem] font-semibold leading-none tracking-[-0.07em] text-zinc-50 tabular-nums">{value}</div>
        </div>
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br text-white shadow-lg", accent)}>{icon}</div>
      </div>
      <div className="relative mt-5">
        <div className="mb-2 flex items-center justify-between gap-3"><p className="text-xs font-medium text-zinc-400">{detail}</p>{safeProgress !== null && <span className="text-[11px] font-semibold tabular-nums text-zinc-300">{Math.round(safeProgress)}%</span>}</div>
        {safeProgress !== null && <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", accent)} style={{ width: `${safeProgress}%` }} /></div>}
      </div>
      <div className="relative mt-4 flex min-h-5 items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">{footer ?? <span>Academic snapshot</span>}<ChevronRight className="h-3.5 w-3.5 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300" /></div>
    </article>
  );
}
