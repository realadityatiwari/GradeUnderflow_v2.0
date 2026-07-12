export const CHART_COLORS = {
  primary: "#7c8cff",
  primaryMuted: "#55637b",
  secondary: "#52d3a7",
  warning: "#fbbf24",
  danger: "#fb7185",
  cyan: "#38bdf8",
  axis: "#a1a1aa",
  axisMuted: "#71717a",
  grid: "#ffffff",
  surface: "#09090b",
  border: "#27272a",
} as const;

export const chartAxisTick = { fill: CHART_COLORS.axis, fontSize: 12, fontWeight: 600 };
export const chartAxisMutedTick = { fill: CHART_COLORS.axisMuted, fontSize: 11, fontWeight: 600 };
export const chartTooltipStyle = {
  backgroundColor: "rgba(9, 9, 11, 0.96)",
  border: `1px solid ${CHART_COLORS.border}`,
  borderRadius: "12px",
  color: "#f4f4f5",
  boxShadow: "0 18px 45px -24px rgba(0, 0, 0, 0.95)",
  fontSize: "12px",
};
