"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full relative overflow-hidden bg-gradient-to-br from-card to-card/50">
      <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 bg-primary -mr-10 -mt-10 rounded-full" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Grade Prediction
            </CardTitle>
            <CardDescription>Based on your current trajectory</CardDescription>
          </div>
          <div className="text-right flex flex-col items-end">
             <div className="text-4xl font-bold tracking-tighter text-primary flex items-baseline gap-1">
               {final.grade}
               <span className="text-sm font-normal text-muted-foreground ml-1">({final.percentage}%)</span>
             </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                Internal Marks
                <Badge variant="outline" className="text-[10px]">
                  {prediction.current_internal_marks} / {prediction.max_internal_marks}
                </Badge>
              </span>
              <span className="text-sm text-muted-foreground">{prediction.completion_percentage}% complete</span>
            </div>
            <Progress value={prediction.completion_percentage} className="h-2" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
            <div className="flex items-center gap-2">
              {isHighConfidence ? (
                <Sparkles className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              )}
              <div className="text-sm font-medium">Confidence Level</div>
            </div>
            <Badge variant={isHighConfidence ? "default" : "secondary"}>
              {prediction.confidence}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
