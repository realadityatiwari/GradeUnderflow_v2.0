"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DistributionDatasets } from "@/lib/services/analytics";

const gradeColors: Record<string, string> = {
  "A+": "#6ee7b7", A: "#41c7a1", "B+": "#7c8cff", B: "#5d6fe6", C: "#fbbf24", D: "#fb923c", E: "#fb7185", F: "#f43f5e",
};

function DistributionTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <div className="min-w-32 rounded-xl border border-white/10 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Grade segment</p>
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: gradeColors[data.label] ?? "hsl(var(--primary))" }} />
          {data.label}
        </span>
        <span className="text-sm font-semibold text-zinc-400 tabular-nums">{data.value}</span>
      </div>
    </div>
  );
}

export function DistributionChart({ data }: { data: DistributionDatasets }) {
  if (!data || !data.grade_distribution) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Grade Distribution</CardTitle>
        <CardDescription>Predicted outcomes</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="h-[250px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.grade_distribution}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                nameKey="label"
                stroke="none"
                cornerRadius={4}
                animationDuration={1000}
              >
                {data.grade_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={gradeColors[entry.label] ?? "hsl(var(--primary))"} />
                ))}
              </Pie>
              <Tooltip content={<DistributionTooltip />} cursor={{ fill: "transparent" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
                {data.grade_distribution.reduce((acc, curr) => acc + curr.value, 0)}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Total</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
