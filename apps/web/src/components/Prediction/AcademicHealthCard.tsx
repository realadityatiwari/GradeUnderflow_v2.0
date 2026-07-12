"use client";

import { useEffect, useState } from "react";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { Progress } from "@/components/ui/progress";
import { Activity, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { AcademicHealthResponse, predictionService } from "@/lib/services/prediction";

export function AcademicHealthCard({ semesterId }: { semesterId: string }) {
  const [health, setHealth] = useState<AcademicHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    predictionService.getAcademicHealth(semesterId)
      .then(setHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [semesterId]);

  if (loading) {
    return (
      <DashboardSurface className="p-5">
        <div className="flex items-start justify-between">
          <div className="w-full">
            <div className="h-3 w-32 bg-white/[0.06] rounded animate-pulse" />
            <div className="mt-3 h-7 w-48 bg-white/[0.08] rounded animate-pulse" />
            <div className="mt-5 h-2 w-full bg-white/[0.06] rounded-full animate-pulse" />
          </div>
        </div>
      </DashboardSurface>
    );
  }

  if (!health) return null;

  const getColor = (score: number) => {
    if (score >= 85) return "text-emerald-300";
    if (score >= 70) return "text-sky-300";
    if (score >= 50) return "text-amber-300";
    if (score >= 35) return "text-orange-300";
    return "text-rose-300";
  };

  const getProgressAccent = (score: number) => {
    if (score >= 85) return "from-emerald-400 to-teal-500";
    if (score >= 70) return "from-sky-400 to-blue-500";
    if (score >= 50) return "from-amber-400 to-orange-500";
    if (score >= 35) return "from-orange-400 to-red-500";
    return "from-rose-400 to-red-500";
  };

  const colorClass = getColor(health.health_score);

  return (
    <DashboardSurface>
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">Intelligence matrix</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Academic Health</h2>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
          <Activity className="h-4 w-4" />
        </span>
      </div>
      <div className="px-5 pb-5 pt-4 sm:px-6">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Health score</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-4xl font-semibold tracking-[-0.07em] tabular-nums ${colorClass}`}>{health.health_score}</span>
              <span className="text-base font-medium tracking-normal text-zinc-500">/100</span>
            </div>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200">{health.health_status}</span>
        </div>
        <div className="mt-5">
          <Progress value={health.health_score} indicatorClassName={`bg-gradient-to-r ${getProgressAccent(health.health_score)}`} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/[0.07] pt-5">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-zinc-500">Strongest</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-zinc-100">
              {health.strongest_subject ? (
                <><CheckCircle className="h-4 w-4 text-emerald-400" /> {health.strongest_subject}</>
              ) : (
                <><HelpCircle className="h-4 w-4 text-zinc-500" /> N/A</>
              )}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-zinc-500">Weakest</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-zinc-100">
              {health.weakest_subject ? (
                <><AlertTriangle className="h-4 w-4 text-amber-400" /> {health.weakest_subject}</>
              ) : (
                <><HelpCircle className="h-4 w-4 text-zinc-500" /> N/A</>
              )}
            </p>
          </div>
        </div>
      </div>
    </DashboardSurface>
  );
}
