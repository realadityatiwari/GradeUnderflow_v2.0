import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardTooltipProps {
  children: ReactNode;
  className?: string;
}

export function DashboardTooltip({ children, className }: DashboardTooltipProps) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}

interface TooltipRowProps {
  color: string;
  label: string;
  value: string | number;
}

export function TooltipRow({ color, label, value }: TooltipRowProps) {
  return (
    <div className="flex items-center justify-between gap-7 text-xs">
      <span className="flex items-center gap-2 text-zinc-300">
        <i className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <strong className="tabular-nums text-zinc-50">{value}</strong>
    </div>
  );
}
