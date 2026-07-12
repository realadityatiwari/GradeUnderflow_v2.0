"use client";

import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { CalendarDays, Sparkles } from "lucide-react";

export function TimelineChart() {
  return (
    <DashboardSurface className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,140,255,0.11),transparent_45%),rgba(9,9,11,0.72)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
      <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4 relative">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">Coming soon</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Academic Timeline</h2>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-400/10 text-indigo-300">
          <CalendarDays className="h-4 w-4" />
        </span>
      </header>
      <div className="relative flex min-h-[250px] items-center justify-center px-6 py-8">
        <div className="max-w-[250px] text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-zinc-300">Timeline view coming soon</p>
          <p className="mt-1.5 text-xs leading-5 text-zinc-500">A chronological breakdown of your academic milestones and assessment dates.</p>
        </div>
      </div>
    </DashboardSurface>
  );
}
