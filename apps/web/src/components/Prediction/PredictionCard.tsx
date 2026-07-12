"use client";

import { useEffect, useState } from "react";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Target, AlertCircle } from "lucide-react";
import { SubjectPredictionResponse, predictionService } from "@/lib/services/prediction";

export function PredictionCard({ subjectId }: { subjectId: string }) {
  const [prediction, setPrediction] = useState<SubjectPredictionResponse | null>(null);

  useEffect(() => {
    predictionService.getSubjectPrediction(subjectId).then(setPrediction).catch(console.error);
  }, [subjectId]);

  if (!prediction) return null;

  const { final } = prediction.predicted_eval;
  const isHighConfidence = prediction.confidence === "HIGH";

  return (
    <DashboardSurface className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_0%,rgba(124,140,255,0.18),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent" />
      <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4 relative">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-300/15">
              <Brain className="h-3.5 w-3.5 text-indigo-200" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-200">AI forecast</p>
          </div>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Grade Prediction</h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tracking-[-0.06em] tabular-nums text-indigo-200">
            {final.grade}
          </p>
          <p className="text-xs font-medium text-zinc-500">({final.percentage}%)</p>
        </div>
      </header>
      <div className="p-5 sm:px-6 space-y-5 relative">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-300 flex items-center gap-2">
              Internal Marks
              <Badge variant="outline" className="text-[9px] uppercase tracking-[0.1em]">
                {prediction.current_internal_marks} / {prediction.max_internal_marks}
              </Badge>
            </span>
            <span className="text-xs text-zinc-500">{prediction.completion_percentage}% complete</span>
          </div>
          <Progress value={prediction.completion_percentage} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
          <div className="flex items-center gap-2">
            {isHighConfidence ? (
              <Sparkles className="h-4 w-4 text-emerald-300" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-300" />
            )}
            <span className="text-sm font-medium text-zinc-200">Confidence Level</span>
          </div>
          <Badge variant={isHighConfidence ? "default" : "secondary"} className="text-[9px] uppercase tracking-[0.1em]">
            {prediction.confidence}
          </Badge>
        </div>
      </div>
    </DashboardSurface>
  );
}
