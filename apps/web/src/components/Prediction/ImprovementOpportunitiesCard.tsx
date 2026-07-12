"use client";

import { useEffect, useState } from "react";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { TrendingUp, ArrowUpRight, Sparkles } from "lucide-react";
import { AcademicHealthResponse, predictionService } from "@/lib/services/prediction";

export function ImprovementOpportunitiesCard({ semesterId }: { semesterId: string }) {
  const [health, setHealth] = useState<AcademicHealthResponse | null>(null);

  useEffect(() => {
    predictionService.getAcademicHealth(semesterId).then(setHealth).catch(console.error);
  }, [semesterId]);

  if (!health || health.improvement_opportunities.length === 0) return null;

  return (
    <DashboardSurface className="h-full">
      <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">GPA gains</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Improvement Opportunities</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Top areas to maximize your SGPA</p>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
          <TrendingUp className="h-4 w-4" />
        </span>
      </header>
      <div className="divide-y divide-white/[0.07]">
        {health.improvement_opportunities.map((opp, idx) => (
          <div key={idx} className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-100">{opp.subject_code}</span>
                <span className="rounded-md border border-white/[0.08] bg-zinc-950/45 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.11em] text-zinc-400">
                  {opp.assessment_title}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500 truncate">{opp.subject_name}</p>
            </div>
            <div className="shrink-0 text-right ml-3">
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
                +{opp.potential_gpa_gain} marks
              </div>
              <p className="text-[10px] text-zinc-500">potential gain</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.018] px-5 py-3 text-[10px] text-zinc-500">
        <span>Sorted by highest gain potential</span>
        <Sparkles className="h-3.5 w-3.5 text-zinc-600" />
      </div>
    </DashboardSurface>
  );
}
