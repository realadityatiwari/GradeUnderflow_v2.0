import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardChartHeaderProps {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  accent?: string;
  legend?: ReactNode;
  className?: string;
}

const iconBgMap: Record<string, string> = {
  indigo: "bg-indigo-400/10 text-indigo-300",
  violet: "bg-violet-400/10 text-violet-300",
  sky: "bg-sky-400/10 text-sky-300",
  amber: "bg-amber-400/10 text-amber-300",
  emerald: "bg-emerald-400/10 text-emerald-300",
};

export function DashboardChartHeader({ eyebrow, title, icon, accent = "indigo", legend, className }: DashboardChartHeaderProps) {
  const iconStyle = iconBgMap[accent] ?? "bg-indigo-400/10 text-indigo-300";

  return (
    <header className={cn("flex flex-col gap-5 border-b border-white/[0.07] px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between", className)}>
      <div>
        <div className="flex items-center gap-2">
          <span className={cn("grid h-7 w-7 place-items-center rounded-lg", iconStyle)}>{icon}</span>
          <p className={cn("text-[10px] font-bold uppercase tracking-[0.16em]", "text-indigo-300")}>{eyebrow}</p>
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-zinc-50">{title}</h2>
      </div>
      {legend && <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-zinc-400">{legend}</div>}
    </header>
  );
}

export function ChartLegend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </>
  );
}
