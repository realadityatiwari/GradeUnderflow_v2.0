"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { DashboardChartHeader, ChartLegend } from "@/components/ds/DashboardChartHeader";
import { DashboardTooltip, TooltipRow } from "@/components/ds/DashboardTooltip";
import { ComparisonDatasets } from "@/lib/services/analytics";
import { BarChart3 } from "lucide-react";

const INTERNAL_COLOR = "#55637b";
const EXTERNAL_COLOR = "#7c8cff";

function CompTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <DashboardTooltip>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{label}</p>
      <div className="mt-3 space-y-2.5">
        {payload.map((entry, i) => (
          <TooltipRow key={i} color={entry.color} label={entry.name ?? ""} value={entry.value?.toFixed(1) ?? "—"} />
        ))}
      </div>
    </DashboardTooltip>
  );
}

export function ComparisonChart({ data }: { data: ComparisonDatasets }) {
  if (!data || !data.internal_vs_external) return null;

  return (
    <DashboardSurface>
      <DashboardChartHeader
        eyebrow="Performance comparison"
        title="Internal vs External Performance"
        icon={<BarChart3 className="h-3.5 w-3.5" />}
        accent="indigo"
        legend={
          <ChartLegend
            items={[
              { color: INTERNAL_COLOR, label: "Internal Marks" },
              { color: EXTERNAL_COLOR, label: "External Marks" },
            ]}
          />
        }
      />
      <div className="h-[355px] px-2 pb-1 pt-4 sm:h-[385px] sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.internal_vs_external} margin={{ top: 24, right: 18, left: -12, bottom: 10 }} barGap={7} barCategoryGap="28%">
            <CartesianGrid vertical={false} stroke="#ffffff" strokeOpacity={0.09} strokeDasharray="3 5" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              dy={10}
              tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 11, fontWeight: 600 }}
              width={38}
            />
            <Tooltip cursor={{ fill: "#ffffff", fillOpacity: 0.045 }} content={<CompTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="rect"
              formatter={(value) => <span className="text-[11px] font-semibold text-zinc-400">{value}</span>}
            />
            <Bar dataKey="value" name="Internal Marks" fill={INTERNAL_COLOR} radius={[5, 5, 1, 1]} maxBarSize={48} animationDuration={800} />
            <Bar dataKey="secondary_value" name="External Marks" fill={EXTERNAL_COLOR} radius={[5, 5, 1, 1]} maxBarSize={48} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardSurface>
  );
}
