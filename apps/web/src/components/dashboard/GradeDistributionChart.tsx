"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartsData } from "@/lib/services/dashboard";
import { PieChart as PieChartIcon, Sparkles } from "lucide-react";

type GradeItem = { name: string; value: number };

const gradeColors: Record<string, string> = {
  "A+": "#6ee7b7", A: "#41c7a1", "B+": "#7c8cff", B: "#5d6fe6", C: "#fbbf24", D: "#fb923c", E: "#fb7185", F: "#f43f5e",
};

function GradeTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: GradeItem; value?: number }> }) {
  if (!active || !payload?.[0]?.payload) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950/95 px-3 py-2.5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Predicted grade</p>
      <p className="mt-1 text-sm font-semibold text-zinc-100">{item.name} <span className="text-zinc-500">· {item.value} subject{item.value === 1 ? "" : "s"}</span></p>
    </div>
  );
}

export function GradeDistributionChart({ data }: { data: ChartsData }) {
  const grades = (data.grade_distribution ?? []) as GradeItem[];
  const isEmpty = grades.length === 0;
  const total = grades.reduce((sum, grade) => sum + grade.value, 0);
  const topGrade = grades.reduce<GradeItem | null>((best, grade) => !best || grade.value > best.value ? grade : best, null);
  const atRisk = grades.filter((grade) => ["D", "E", "F"].includes(grade.name)).reduce((sum, grade) => sum + grade.value, 0);

  return (
    <section className="h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.95)]">
      <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">Projection mix</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Grade distribution</h2>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-400/10 text-violet-300"><PieChartIcon className="h-4 w-4" /></span>
      </header>

      {isEmpty ? (
        <div className="grid min-h-[270px] place-items-center px-6 py-8 text-center">
          <div className="max-w-[250px]">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400"><PieChartIcon className="h-5 w-5" /></span>
            <h3 className="mt-3 text-sm font-semibold text-zinc-100">No grades projected yet</h3>
            <p className="mt-1.5 text-xs leading-5 text-zinc-500">Add enough assessment results to build a useful grade forecast.</p>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <div className="grid items-center gap-3 sm:grid-cols-[minmax(160px,0.9fr)_minmax(0,1.1fr)]">
            <div className="relative mx-auto h-[190px] w-full max-w-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={grades} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={54} outerRadius={78} paddingAngle={3} stroke="none" cornerRadius={4} animationDuration={800}>
                    {grades.map((grade) => <Cell key={grade.name} fill={gradeColors[grade.name] ?? "#7c8cff"} />)}
                  </Pie>
                  <Tooltip content={<GradeTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-2xl font-semibold tracking-[-0.06em] text-zinc-50 tabular-nums">{total}</p>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Subjects</p>
                </div>
              </div>
            </div>

            <div className="grid gap-1.5">
              {grades.map((grade) => {
                const percentage = total ? Math.round((grade.value / total) * 100) : 0;
                return (
                  <div key={grade.name} className="flex items-center gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/[0.035]">
                    <i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: gradeColors[grade.name] ?? "#7c8cff" }} />
                    <span className="min-w-6 text-xs font-semibold text-zinc-200">{grade.name}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: gradeColors[grade.name] ?? "#7c8cff" }} /></div>
                    <span className="w-12 text-right text-[11px] font-semibold tabular-nums text-zinc-400">{grade.value} · {percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07]">
            <div className="bg-zinc-950/80 px-3 py-2.5"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">Most likely</p><p className="mt-1 text-xs font-semibold text-zinc-100">{topGrade?.name} <span className="text-zinc-500">· {topGrade?.value} subjects</span></p></div>
            <div className="bg-zinc-950/80 px-3 py-2.5"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">Needs attention</p><p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-zinc-100"><Sparkles className="h-3 w-3 text-amber-300" />{atRisk} at-risk subject{atRisk === 1 ? "" : "s"}</p></div>
          </div>
        </div>
      )}
    </section>
  );
}
