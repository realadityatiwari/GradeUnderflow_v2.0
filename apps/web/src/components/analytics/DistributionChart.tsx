"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { DashboardTooltip } from "@/components/ds/DashboardTooltip";
import { DistributionDatasets } from "@/lib/services/analytics";
import { PieChart as PieChartIcon } from "lucide-react";

const gradeColors: Record<string, string> = {
  "A+": "#6ee7b7", A: "#41c7a1", "B+": "#7c8cff", B: "#5d6fe6", C: "#fbbf24", D: "#fb923c", E: "#fb7185", F: "#f43f5e",
};

function DistTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <DashboardTooltip>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Grade segment</p>
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: gradeColors[data.label] ?? "#7c8cff" }} />
          {data.label}
        </span>
        <span className="text-sm font-semibold text-zinc-400 tabular-nums">{data.value}</span>
      </div>
    </DashboardTooltip>
  );
}

export function DistributionChart({ data }: { data: DistributionDatasets }) {
  if (!data || !data.grade_distribution) return null;
  const grades = data.grade_distribution;
  const total = grades.reduce((acc, curr) => acc + curr.value, 0);
  const topGrade = grades.reduce<typeof grades[number] | null>((best, g) => !best || g.value > best.value ? g : best, null);
  const atRisk = grades.filter((g) => ["D", "E", "F"].includes(g.label)).reduce((sum, g) => sum + g.value, 0);

  return (
    <DashboardSurface className="h-full">
      <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">Projection mix</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Grade Distribution</h2>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-400/10 text-violet-300">
          <PieChartIcon className="h-4 w-4" />
        </span>
      </header>
      <div className="p-4 sm:p-5">
        <div className="grid items-center gap-3 sm:grid-cols-[minmax(160px,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative mx-auto h-[190px] w-full max-w-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={grades}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="label"
                  stroke="none"
                  cornerRadius={4}
                  animationDuration={800}
                >
                  {grades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={gradeColors[entry.label] ?? "#7c8cff"} />
                  ))}
                </Pie>
                <Tooltip content={<DistTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-2xl font-semibold tracking-[-0.06em] text-zinc-50 tabular-nums">{total}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Total</p>
              </div>
            </div>
          </div>

          <div className="grid gap-1.5">
            {grades.map((grade) => {
              const pct = total ? Math.round((grade.value / total) * 100) : 0;
              return (
                <div key={grade.label} className="flex items-center gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/[0.035]">
                  <i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: gradeColors[grade.label] ?? "#7c8cff" }} />
                  <span className="min-w-6 text-xs font-semibold text-zinc-200">{grade.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: gradeColors[grade.label] ?? "#7c8cff" }} />
                  </div>
                  <span className="w-12 text-right text-[11px] font-semibold tabular-nums text-zinc-400">{grade.value} · {pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07]">
          <div className="bg-zinc-950/80 px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">Most likely</p>
            <p className="mt-1 text-xs font-semibold text-zinc-100">{topGrade?.label} <span className="text-zinc-500">· {topGrade?.value} subjects</span></p>
          </div>
          <div className="bg-zinc-950/80 px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">Needs attention</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-zinc-100"><span className="h-3 w-3 text-amber-300 inline-flex items-center justify-center text-[10px]">⚠</span>{atRisk} at-risk</p>
          </div>
        </div>
      </div>
    </DashboardSurface>
  );
}
