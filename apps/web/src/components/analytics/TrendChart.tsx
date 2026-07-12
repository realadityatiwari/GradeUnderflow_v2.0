"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { DashboardChartHeader, ChartLegend } from "@/components/ds/DashboardChartHeader";
import { DashboardTooltip, TooltipRow } from "@/components/ds/DashboardTooltip";
import { TrendDatasets } from "@/lib/services/analytics";
import { TrendingUp } from "lucide-react";

const CHART_ACCENT = "#7c8cff";

function TrendTooltipContent({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <DashboardTooltip>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{label}</p>
      <div className="mt-3">
        <TooltipRow color={CHART_ACCENT} label="Overall" value={val?.toFixed(1) ?? "—"} />
      </div>
    </DashboardTooltip>
  );
}

export function TrendChart({ data }: { data: TrendDatasets }) {
  if (!data || !data.overall_percentage) return null;

  return (
    <DashboardSurface>
      <DashboardChartHeader
        eyebrow="Performance trends"
        title="Performance Trends"
        icon={<TrendingUp className="h-3.5 w-3.5" />}
        accent="indigo"
        legend={<ChartLegend items={[{ color: CHART_ACCENT, label: "Overall percentage" }]} />}
      />
      <div className="h-[355px] px-2 pb-1 pt-4 sm:h-[385px] sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.overall_percentage} margin={{ top: 20, right: 20, left: -12, bottom: 10 }}>
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
              domain={[0, 100]}
              width={38}
            />
            <Tooltip
              cursor={{ stroke: CHART_ACCENT, strokeWidth: 1.5, strokeDasharray: "4 4" }}
              content={<TrendTooltipContent />}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Percentage"
              stroke={CHART_ACCENT}
              strokeWidth={3}
              dot={{ r: 4, fill: "#09090b", strokeWidth: 2, stroke: CHART_ACCENT }}
              activeDot={{ r: 6, fill: CHART_ACCENT, stroke: "#09090b", strokeWidth: 2 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardSurface>
  );
}
