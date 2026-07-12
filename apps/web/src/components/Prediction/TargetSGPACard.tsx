"use client";

import { useState } from "react";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, TrendingUp, ArrowUpRight } from "lucide-react";
import { TargetSGPAResponse, predictionService } from "@/lib/services/prediction";

export function TargetSGPACard({ semesterId }: { semesterId: string }) {
  const [targetSgpa, setTargetSgpa] = useState("9.0");
  const [result, setResult] = useState<TargetSGPAResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateTarget = async () => {
    const target = parseFloat(targetSgpa);
    if (isNaN(target)) return;
    setLoading(true);
    try {
      const res = await predictionService.calculateTargetSGPA(semesterId, target);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardSurface>
      <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">SGPA planner</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Target SGPA Planner</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Find out what it takes to hit your goal</p>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-400/10 text-sky-300">
          <Target className="h-4 w-4" />
        </span>
      </header>
      <div className="p-5 sm:px-6 space-y-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={targetSgpa}
            onChange={e => setTargetSgpa(e.target.value)}
            placeholder="e.g. 9.0"
          />
          <Button onClick={calculateTarget} disabled={loading} className="shrink-0">
            {loading ? "Calculating..." : "Calculate"}
          </Button>
        </div>

        {result && (
          <div className={`rounded-xl border p-4 ${result.is_possible ? 'border-emerald-300/20 bg-emerald-300/[0.06]' : 'border-rose-300/20 bg-rose-300/[0.06]'}`}>
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              {result.is_possible ? (
                <TrendingUp className="h-4 w-4 text-emerald-300" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-rose-300" />
              )}
              <span className={result.is_possible ? "text-emerald-200" : "text-rose-200"}>{result.message}</span>
            </div>
            {result.is_possible && (
              <div className="text-2xl font-semibold tracking-[-0.05em] tabular-nums text-zinc-50">
                {result.required_credit_points}
                <span className="ml-1 text-sm font-medium tracking-normal text-zinc-500">Credit Points Required</span>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardSurface>
  );
}
