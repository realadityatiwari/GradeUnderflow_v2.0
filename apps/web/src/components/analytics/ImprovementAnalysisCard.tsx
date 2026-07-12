"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImprovementAnalysisItem } from "@/lib/services/analytics";
import { TrendingUp, Target, ArrowRight } from "lucide-react";

export function ImprovementAnalysisCard({ items }: { items: ImprovementAnalysisItem[] }) {
  if (!items || items.length === 0) return null;

  const getPriorityColor = (severity: string) => {
    switch(severity) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "default";
      case "WARNING": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
            <TrendingUp className="h-3.5 w-3.5" />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">Action Plan</p>
        </div>
        <CardTitle className="mt-3 text-lg">Improvement Analysis</CardTitle>
        <CardDescription>Targeted areas for GPA gain</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="divide-y divide-border/50">
          {items.map((item, idx) => (
            <div key={idx} className="group flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <Badge variant={getPriorityColor(item.severity) as any}>
                    {item.severity}
                  </Badge>
                  <span className="font-semibold text-sm text-zinc-100 group-hover:text-primary transition-colors">{item.subject}</span>
                </div>
                <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 pt-0.5">
                  <Target className="h-3 w-3" />
                  Gap: {item.gap.toFixed(1)}% to target
                </div>
              </div>
              <div className="flex flex-col items-end text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-semibold line-through text-xs">{item.current_percentage.toFixed(0)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-emerald-400 font-bold tracking-tight text-base tabular-nums">{item.target_percentage.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
