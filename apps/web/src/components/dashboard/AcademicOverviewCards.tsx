import type { ReactNode } from "react";
import { OverviewData } from "@/lib/services/dashboard";
import {
  Activity,
  Award,
  ChevronRight,
  GraduationCap,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  detail: string;
  icon: ReactNode;
  accent: string;
  meter: number;
  footer?: ReactNode;
};

function MetricCard({ label, value, detail, icon, accent, meter, footer }: MetricCardProps) {
  return (
    <article className="group relative min-h-[188px] overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/65 p-5 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-zinc-900/80">
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accent}`} />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.025] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
          <div className="mt-3 text-[2.35rem] font-semibold leading-none tracking-[-0.07em] text-zinc-50 tabular-nums">
            {value}
          </div>
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br ${accent} text-white shadow-lg`}>
          {icon}
        </div>
      </div>

      <div className="relative mt-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-zinc-400">{detail}</p>
          <span className="text-[11px] font-semibold tabular-nums text-zinc-300">{Math.round(Math.min(100, Math.max(0, meter)))}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all duration-700`} style={{ width: `${Math.min(100, Math.max(0, meter))}%` }} />
        </div>
      </div>

      <div className="relative mt-4 flex min-h-5 items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
        {footer ?? <span>Academic snapshot</span>}
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300" />
      </div>
    </article>
  );
}

export function AcademicOverviewCards({ data }: { data: OverviewData }) {
  const health = Math.min(100, Math.max(0, data.academic_health));
  const internalProgress = data.total_internal_marks > 0
    ? (data.internal_marks_earned / data.total_internal_marks) * 100
    : 0;
  const sgpaTrend = data.current_sgpa - data.current_cgpa;
  const healthLabel = health >= 85 ? "Excellent" : health >= 70 ? "Strong" : health >= 50 ? "Watchlist" : "Needs attention";
  const healthAccent = health >= 70 ? "from-emerald-400 to-teal-500" : health >= 50 ? "from-amber-400 to-orange-500" : "from-rose-400 to-red-500";

  return (
    <section aria-label="Academic overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Current SGPA"
        value={data.current_sgpa.toFixed(2)}
        detail={`${data.semester_credits} credit semester`}
        icon={<Target className="h-4 w-4" />}
        accent="from-indigo-400 to-violet-500"
        meter={data.current_sgpa * 10}
        footer={
          <span className={sgpaTrend > 0 ? "flex items-center gap-1 text-emerald-400" : sgpaTrend < 0 ? "flex items-center gap-1 text-amber-400" : "flex items-center gap-1 text-zinc-500"}>
            {sgpaTrend > 0 ? <TrendingUp className="h-3 w-3" /> : sgpaTrend < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {sgpaTrend === 0 ? "Matches CGPA" : `${Math.abs(sgpaTrend).toFixed(2)} vs CGPA`}
          </span>
        }
      />

      <MetricCard
        label="Cumulative CGPA"
        value={data.current_cgpa.toFixed(2)}
        detail="Across all completed terms"
        icon={<GraduationCap className="h-4 w-4" />}
        accent="from-sky-400 to-blue-600"
        meter={data.current_cgpa * 10}
        footer={<span>Long-term standing</span>}
      />

      <MetricCard
        label="Academic health"
        value={<>{health}<span className="ml-1 text-lg font-medium tracking-normal text-zinc-500">/100</span></>}
        detail={healthLabel}
        icon={<Activity className="h-4 w-4" />}
        accent={healthAccent}
        meter={health}
        footer={<span className={health >= 70 ? "text-emerald-400" : health >= 50 ? "text-amber-400" : "text-rose-400"}>{healthLabel} trajectory</span>}
      />

      <MetricCard
        label="Internal marks"
        value={<>{data.internal_marks_earned}<span className="ml-1 text-lg font-medium tracking-normal text-zinc-500">/{data.total_internal_marks}</span></>}
        detail="Marks recorded so far"
        icon={<Award className="h-4 w-4" />}
        accent="from-fuchsia-400 to-pink-500"
        meter={internalProgress}
        footer={<span>{Math.round(internalProgress)}% of available marks</span>}
      />
    </section>
  );
}
