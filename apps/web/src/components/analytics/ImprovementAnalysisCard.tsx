"use client";

import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { Badge } from "@/components/ui/badge";
import { ImprovementAnalysisItem } from "@/lib/services/analytics";
import { TrendingUp, Target, ArrowRight, Sparkles } from "lucide-react";

export function ImprovementAnalysisCard({ items }: { items: ImprovementAnalysisItem[] }) {
  if (!items || items.length === 0) return null;

  const getBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return <Badge className="border-rose-300/20 bg-rose-300/10 text-rose-200 text-[9px] uppercase tracking-[0.1em]">{severity}</Badge>;
      case "HIGH": return <Badge className="border-amber-300/20 bg-amber-300/10 text-amber-200 text-[9px] uppercase tracking-[0.1em]">{severity}</Badge>;
      case "WARNING": return <Badge className="border-sky-300/20 bg-sky-300/10 text-sky-200 text-[9px] uppercase tracking-[0.1em]">{severity}</Badge>;
      default: return <Badge variant="outline" className="text-[9px] uppercase tracking-[0.1em]">{severity}</Badge>;
    }
  };

  return (
    <DashboardSurface className="h-full">
      <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">Action plan</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Improvement Analysis</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Targeted areas for GPA gain</p>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
          <TrendingUp className="h-4 w-4" />
        </span>
      </header>
      <div className="divide-y divide-white/[0.07]">
        {items.map((item, idx) => (
          <div key={idx} className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                {getBadge(item.severity)}
                <span className="text-sm font-semibold text-zinc-100 truncate">{item.subject}</span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                <Target className="h-3 w-3" />
                Gap: {item.gap.toFixed(1)}% to target
              </p>
            </div>
            <div className="shrink-0 text-right ml-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-zinc-600 font-semibold line-through text-xs">{item.current_percentage.toFixed(0)}</span>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
                <span className="text-emerald-400 font-bold tracking-tight text-base tabular-nums">{item.target_percentage.toFixed(0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.018] px-5 py-3 text-[10px] text-zinc-500">
        <span>Prioritized by impact potential</span>
        <Sparkles className="h-3.5 w-3.5 text-zinc-600" />
      </div>
    </DashboardSurface>
  );
}
