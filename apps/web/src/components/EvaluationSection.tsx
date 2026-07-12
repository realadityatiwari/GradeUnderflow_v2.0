"use client";

import { useEffect, useState } from "react";
import { Loader2, Activity } from "lucide-react";
import { EvaluationResultResponse, evaluationService } from "@/lib/services/evaluation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <Card className="mb-8">
        <CardContent className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!evaluation) {
    return null;
  }

  const { internal, external, final } = evaluation;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Internal Marks Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Internal Evaluation</CardTitle>
          <CardDescription>Max 30 Marks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-4">
            {internal.total} <span className="text-sm font-normal text-muted-foreground">/ 30</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Assignments (6)</span>
              <span className="font-medium">{internal.assignment.contribution}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quizzes (9)</span>
              <span className="font-medium">{internal.quiz.contribution}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Surprise Tests (6)</span>
              <span className="font-medium">{internal.surprise.contribution}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pre-End (9)</span>
              <span className="font-medium">{internal.pre_end.contribution}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Marks Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">External Evaluation</CardTitle>
          <CardDescription>Max 70 Marks (End Semester)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-4">
            {external.marks} <span className="text-sm font-normal text-muted-foreground">/ 70</span>
          </div>
          <div className="space-y-2 mt-auto h-full flex flex-col justify-end">
             <div className="flex justify-between text-sm mb-1">
               <span className="text-muted-foreground">Percentage</span>
               <span className="font-medium">{external.percentage.toFixed(1)}%</span>
             </div>
             <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
               <div 
                 className="bg-primary h-full rounded-full transition-all" 
                 style={{ width: `${external.percentage}%` }}
               />
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Marks Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Final Result</CardTitle>
              <CardDescription>Out of 100 Marks</CardDescription>
            </div>
            <Badge variant={final.passed ? "default" : "destructive"} className="px-3 py-1 text-sm">
              {final.passed ? "PASS" : "FAIL"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-black text-primary mb-6">
            {final.marks}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-3 border">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Grade</div>
              <div className="text-2xl font-bold">{final.grade}</div>
            </div>
            <div className="bg-background rounded-lg p-3 border">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Grade Point</div>
              <div className="text-2xl font-bold">{final.grade_point}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
