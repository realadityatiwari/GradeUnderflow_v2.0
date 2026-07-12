"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartsData } from "@/lib/services/dashboard";
import { BarChart3, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

type SubjectPoint = { name: string; predicted: number; current: number };

const CURRENT = "#55637b";
const PREDICTED = "#7c8cff";
const STRONGEST = "#52d3a7";
const WEAKEST = "#fb7185";

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey?: string; value?: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const predicted = payload.find((item) => item.dataKey === "predicted")?.value;
  const current = payload.find((item) => item.dataKey === "current")?.value;

  return (
    <div className="min-w-44 rounded-xl border border-white/10 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{label}</p>
      <div className="mt-3 space-y-2.5">
        <div className="flex items-center justify-between gap-7 text-xs">
          <span className="flex items-center gap-2 text-zinc-300"><i className="h-2 w-2 rounded-full bg-[#7c8cff]" />Predicted final</span>
          <strong className="tabular-nums text-zinc-50">{predicted ?? "—"}%</strong>
        </div>
        <div className="flex items-center justify-between gap-7 text-xs">
          <span className="flex items-center gap-2 text-zinc-400"><i className="h-2 w-2 rounded-full bg-[#55637b]" />Current internal</span>
          <strong className="tabular-nums text-zinc-50">{current ?? "—"}</strong>
        </div>
      </div>
    </div>
  );
}

export function SubjectPerformanceChart({ data, target }: { data: ChartsData; target?: number }) {
  const subjects = (data.subject_performance ?? []) as SubjectPoint[];
  const isEmpty = subjects.length === 0;
  const projectedTarget = target ? Math.min(100, Math.max(0, target * 10)) : 90;
  const strongest = subjects.reduce<SubjectPoint | null>((best, subject) => !best || subject.predicted > best.predicted ? subject : best, null);
  const weakest = subjects.reduce<SubjectPoint | null>((worst, subject) => !worst || subject.predicted < worst.predicted ? subject : worst, null);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 shadow-[0_20px_55px_-35px_rgba(0,0,0,0.95)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent" />
      <header className="flex flex-col gap-5 border-b border-white/[0.07] px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-400/10 text-indigo-300"><BarChart3 className="h-3.5 w-3.5" /></span>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">Performance matrix</p>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-zinc-50">Subject performance</h2>
          <p className="mt-1 text-sm text-zinc-500">Projected final scores against the marks you have recorded.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-zinc-400">
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-[#55637b]" />Current internal</span>
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-[#7c8cff]" />Predicted final</span>
          <span className="inline-flex items-center gap-2"><i className="h-px w-3 border-t border-dashed border-amber-300" />Target {projectedTarget}%</span>
        </div>
      </header>

      {isEmpty ? (
        <div className="grid min-h-[360px] place-items-center px-6 py-10">
          <div className="max-w-sm text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-400"><BarChart3 className="h-5 w-5" /></span>
            <h3 className="mt-4 text-base font-semibold text-zinc-100">Your performance map will appear here</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">Record assessment marks to compare each subject’s current internal score with its projected final result.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="h-[355px] px-2 pb-1 pt-4 sm:h-[385px] sm:px-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjects} margin={{ top: 24, right: 18, left: -12, bottom: 10 }} barGap={7} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="#ffffff" strokeOpacity={0.09} strokeDasharray="3 5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} axisLine={false} tickLine={false} width={38} tick={{ fill: "#71717a", fontSize: 11, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: "#ffffff", fillOpacity: 0.045 }} content={<ChartTooltip />} />
                <ReferenceLine y={projectedTarget} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="5 5" />
                <Bar dataKey="current" name="Current internal" fill={CURRENT} radius={[5, 5, 1, 1]} maxBarSize={48} animationDuration={800} />
                <Bar dataKey="predicted" name="Predicted final" radius={[5, 5, 1, 1]} maxBarSize={48} animationDuration={900}>
                  {subjects.map((subject) => <Cell key={subject.name} fill={subject.name === strongest?.name ? STRONGEST : subject.name === weakest?.name ? WEAKEST : PREDICTED} />)}
                  <LabelList dataKey="predicted" position="top" formatter={(value) => `${typeof value === "number" ? Math.round(value) : value ?? "—"}%`} fill="#e4e4e7" fontSize={11} fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid border-t border-white/[0.07] sm:grid-cols-2">
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4 sm:border-b-0 sm:border-r sm:px-6">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><TrendingUp className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Strongest projection</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-zinc-100">{strongest?.name} <span className="ml-1 text-emerald-300">{strongest?.predicted.toFixed(0)}%</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-400/10 text-rose-300"><TrendingDown className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Focus next</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-zinc-100">{weakest?.name} <span className="ml-1 text-rose-300">{weakest?.predicted.toFixed(0)}%</span></p>
              </div>
              <Sparkles className="ml-auto h-4 w-4 text-zinc-700" />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
