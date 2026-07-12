"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { AcademicHealthResponse, predictionService } from "@/lib/services/prediction";

export function ImprovementOpportunitiesCard({ semesterId }: { semesterId: string }) {
  const [health, setHealth] = useState<AcademicHealthResponse | null>(null);

  useEffect(() => {
    predictionService.getAcademicHealth(semesterId).then(setHealth).catch(console.error);
  }, [semesterId]);

  if (!health || health.improvement_opportunities.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Improvement Opportunities
        </CardTitle>
        <CardDescription>Top areas to maximize your SGPA</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {health.improvement_opportunities.map((opp, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  {opp.subject_code}
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {opp.assessment_title}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {opp.subject_name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-500 flex items-center justify-end gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  +{opp.potential_gpa_gain} marks
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  potential gain
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
