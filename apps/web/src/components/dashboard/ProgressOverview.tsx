"use client";

import { SemesterProgressData } from "@/lib/services/dashboard";
import { CalendarDays, CheckCheck, ClipboardCheck } from "lucide-react";

function CompletionRow({ label, value, color }: { label: string; value: number; color: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3"><span className="text-xs font-medium text-zinc-300">{label}</span><span className="text-xs font-semibold tabular-nums text-zinc-100">{safeValue}%</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]"><div className={`h-full rounded-full ${color}`} style={{ width: `${safeValue}%` }} /></div>
    </div>
  );
}

export function ProgressOverview({ semester }: { semester: SemesterProgressData }) {
  if (!semester) return null;
  const average = Math.round((semester.assessment_completion + semester.assignment_completion) / 2);

  return (
    <section className="h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.95)]">
      <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">Coursework status</p><h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Semester progress</h2></div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-400/10 text-sky-300"><ClipboardCheck className="h-4 w-4" /></span>
      </header>
      <div className="p-5">
        <div className="flex items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Completion score</p><p className="mt-1 text-4xl font-semibold tracking-[-0.07em] tabular-nums text-zinc-50">{average}<span className="ml-1 text-base font-medium tracking-normal text-zinc-500">%</span></p></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-300/10 text-emerald-300"><CheckCheck className="h-5 w-5" /></span></div>
        <div className="mt-5 space-y-4 border-t border-white/[0.07] pt-5"><CompletionRow label="All assessments" value={semester.assessment_completion} color="bg-gradient-to-r from-indigo-400 to-violet-400" /><CompletionRow label="Assignments" value={semester.assignment_completion} color="bg-gradient-to-r from-sky-400 to-cyan-400" /></div>
        <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.13em] text-zinc-500">Semester runway</p><p className="mt-1 text-xs font-semibold text-zinc-200">{semester.days_remaining === null ? "Timeline not set" : "Days remaining"}</p></div><div className="flex items-center gap-2 text-zinc-300"><CalendarDays className="h-4 w-4 text-sky-300" /><strong className="text-xl tracking-[-0.05em] tabular-nums">{semester.days_remaining ?? "—"}</strong></div></div>
      </div>
    </section>
  );
}
