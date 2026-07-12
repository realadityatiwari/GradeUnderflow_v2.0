"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { DashboardTooltip } from "@/components/ds/DashboardTooltip";
import { ComparisonDatasets } from "@/lib/services/analytics";
import { Activity } from "lucide-react";

const RADAR_COLOR = "#7c8cff";

function RadarTooltipContent({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <DashboardTooltip>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{data.label}</p>
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
          <i className="h-2 w-2 rounded-full" style={{ backgroundColor: RADAR_COLOR }} />
          Performance
        </span>
        <span className="text-sm font-semibold text-zinc-50 tabular-nums">{data.value?.toFixed(1) ?? "—"}%</span>
      </div>
    </DashboardTooltip>
  );
}

export function RadarPerformanceChart({ data }: { data: ComparisonDatasets }) {
  if (!data || !data.subject_vs_subject) return null;

  return (
    <DashboardSurface className="h-full">
      <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">Subject radar</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Subject Performance</h2>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-400/10 text-sky-300">
          <Radar className="h-4 w-4" />
        </span>
      </header>
      <div className="flex h-[300px] items-center justify-center p-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data.subject_vs_subject}>
            <PolarGrid stroke="#ffffff" strokeOpacity={0.09} />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "#a1a1aa", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<RadarTooltipContent />} />
            <Radar
              name="Percentage"
              dataKey="value"
              stroke={RADAR_COLOR}
              strokeWidth={2}
              fill={RADAR_COLOR}
              fillOpacity={0.15}
              animationDuration={1000}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </DashboardSurface>
  );
}
