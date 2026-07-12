"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { EvaluationResultResponse, evaluationService } from "@/lib/services/evaluation";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { DashboardMetricCard } from "@/components/ds/DashboardMetricCard";
import { Badge } from "@/components/ui/badge";
import { Award, Target, GraduationCap } from "lucide-react";

export function EvaluationSection({ subjectId }: { subjectId: string }) {
  const [evaluation, setEvaluation] = useState<EvaluationResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEval = async () => {
      try {
        const data = await evaluationService.getEvaluation(subjectId);
        setEvaluation(data);
      } catch (error) {
        console.error("Failed to load evaluation", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEval();
  }, [subjectId]);

  if (isLoading) {
    return (
      <DashboardSurface className="flex min-h-[200px] items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-300" />
      </DashboardSurface>
    );
  }

  if (!evaluation) return null;

  const { internal, external, final } = evaluation;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardMetricCard
          label="Internal Evaluation"
          value={<>{internal.total}<span className="ml-1 text-lg font-medium tracking-normal text-zinc-500">/30</span></>}
          detail="Max 30 Marks"
          icon={<Award className="h-4 w-4" />}
          accent="from-indigo-400 to-violet-500"
          progress={Math.min(100, (internal.total / 30) * 100)}
          footer={<span>Internal score</span>}
        />

        <DashboardMetricCard
          label="External Evaluation"
          value={<>{external.marks}<span className="ml-1 text-lg font-medium tracking-normal text-zinc-500">/70</span></>}
          detail={`${external.percentage.toFixed(1)}% score`}
          icon={<Target className="h-4 w-4" />}
          accent="from-sky-400 to-blue-600"
          progress={Math.min(100, external.percentage)}
          footer={<span>External score</span>}
        />

        <DashboardMetricCard
          label="Final Result"
          value={<>{final.marks}<span className="ml-1 text-lg font-medium tracking-normal text-zinc-500">/100</span></>}
          detail={`Grade ${final.grade} (${final.grade_point})`}
          icon={<GraduationCap className="h-4 w-4" />}
          accent={final.passed ? "from-emerald-400 to-teal-500" : "from-rose-400 to-red-500"}
          progress={final.marks}
          footer={
            <Badge variant={final.passed ? "default" : "destructive"} className="text-[9px] uppercase tracking-[0.1em]">
              {final.passed ? "PASS" : "FAIL"}
            </Badge>
          }
        />
      </div>

      <DashboardSurface>
        <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">Internal breakdown</p>
            <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Evaluation Details</h2>
          </div>
        </header>
        <div className="p-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-zinc-500">Assignments (6)</p>
              <p className="mt-1.5 text-sm font-semibold tabular-nums text-zinc-100">{internal.assignment.contribution}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-zinc-500">Quizzes (9)</p>
              <p className="mt-1.5 text-sm font-semibold tabular-nums text-zinc-100">{internal.quiz.contribution}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-zinc-500">Surprise Tests (6)</p>
              <p className="mt-1.5 text-sm font-semibold tabular-nums text-zinc-100">{internal.surprise.contribution}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-zinc-500">Pre-End (9)</p>
              <p className="mt-1.5 text-sm font-semibold tabular-nums text-zinc-100">{internal.pre_end.contribution}</p>
            </div>
          </div>
        </div>
      </DashboardSurface>
    </div>
  );
}
