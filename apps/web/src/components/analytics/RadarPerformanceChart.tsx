"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComparisonDatasets } from "@/lib/services/analytics";

function RadarTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <div className="min-w-32 rounded-xl border border-white/10 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{data.label}</p>
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
          <i className="h-2 w-2 rounded-full bg-primary" />
          Performance
        </span>
        <span className="text-sm font-semibold text-zinc-50 tabular-nums">{data.value?.toFixed(1) ?? "—"}%</span>
      </div>
    </div>
  );
}

export function RadarPerformanceChart({ data }: { data: ComparisonDatasets }) {
  if (!data || !data.subject_vs_subject) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Subject Performance</CardTitle>
        <CardDescription>Multi-variable performance comparison</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.subject_vs_subject}>
              <PolarGrid stroke="hsl(var(--muted-foreground)/0.15)" />
              <PolarAngleAxis 
                dataKey="label" 
                tick={{ fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 600 }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<RadarTooltip />} />
              <Radar 
                name="Percentage" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="hsl(var(--primary))" 
                fillOpacity={0.2} 
                animationDuration={1000}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
