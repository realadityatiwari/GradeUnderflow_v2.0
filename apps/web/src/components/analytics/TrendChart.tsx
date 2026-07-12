"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendDatasets } from "@/lib/services/analytics";

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;

  return (
    <div className="min-w-32 rounded-xl border border-white/10 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-7 text-xs">
        <span className="flex items-center gap-2 text-zinc-300">
          <i className="h-2 w-2 rounded-full bg-primary" />
          Overall
        </span>
        <strong className="tabular-nums text-zinc-50">{val?.toFixed(1) ?? "—"}%</strong>
      </div>
    </div>
  );
}

export function TrendChart({ data }: { data: TrendDatasets }) {
  if (!data || !data.overall_percentage) return null;

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Performance Trends</CardTitle>
        <CardDescription>Overall percentage progression over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.overall_percentage} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.15)" />
              <XAxis 
                dataKey="label" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 600 }}
                domain={[0, 100]}
              />
              <Tooltip 
                cursor={{ stroke: "hsl(var(--primary)/0.2)", strokeWidth: 2, strokeDasharray: "4 4" }}
                content={<TrendTooltip />}
              />
              <Line 
                type="monotone"
                dataKey="value" 
                name="Percentage" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ r: 4, fill: "hsl(var(--card))", strokeWidth: 2, stroke: "hsl(var(--primary))" }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
