"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Academic Health</CardTitle>
          <CardDescription>Calculating intelligence matrix...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!health) return null;

  const getColor = (score: number) => {
    if (score >= 85) return "text-emerald-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    if (score >= 35) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 35) return "bg-orange-500";
    return "bg-red-500";
  };

  const colorClass = getColor(health.health_score);

  return (
    <Card className="w-full relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -mr-10 -mt-10 ${getProgressColor(health.health_score)} rounded-full`} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className={`h-5 w-5 ${colorClass}`} />
              Academic Health Score
            </CardTitle>
            <CardDescription>AI-generated composite score</CardDescription>
          </div>
          <div className="text-4xl font-bold tracking-tighter">
            <span className={colorClass}>{health.health_score}</span>
            <span className="text-muted-foreground text-2xl">/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{health.health_status}</span>
            </div>
            <Progress value={health.health_score} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Strongest Subject</div>
              <div className="font-medium flex items-center gap-2">
                {health.strongest_subject ? (
                  <><CheckCircle className="h-4 w-4 text-emerald-500" /> {health.strongest_subject}</>
                ) : (
                  <><HelpCircle className="h-4 w-4 text-muted-foreground" /> N/A</>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Weakest Subject</div>
              <div className="font-medium flex items-center gap-2">
                {health.weakest_subject ? (
                  <><AlertTriangle className="h-4 w-4 text-orange-500" /> {health.weakest_subject}</>
                ) : (
                   <><HelpCircle className="h-4 w-4 text-muted-foreground" /> N/A</>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
