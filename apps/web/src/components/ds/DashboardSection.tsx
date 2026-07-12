import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardSectionHeaderProps {
  icon?: ReactNode;
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  accent?: string;
  className?: string;
}

const accentMap: Record<string, string> = {
  indigo: "text-indigo-300",
  violet: "text-violet-300",
  sky: "text-sky-300",
  amber: "text-amber-300",
  emerald: "text-emerald-300",
  fuchsia: "text-fuchsia-300",
  rose: "text-rose-300",
};

const iconBgMap: Record<string, string> = {
  indigo: "bg-indigo-400/10 text-indigo-300",
  violet: "bg-violet-400/10 text-violet-300",
  sky: "bg-sky-400/10 text-sky-300",
  amber: "bg-amber-400/10 text-amber-300",
  emerald: "bg-emerald-400/10 text-emerald-300",
  fuchsia: "bg-fuchsia-400/10 text-fuchsia-300",
  rose: "bg-rose-400/10 text-rose-300",
};

export function DashboardSectionHeader({
  icon,
  eyebrow,
  title,
  description,
  action,
  accent = "indigo",
  className,
}: DashboardSectionHeaderProps) {
  const eyeColor = accentMap[accent] ?? "text-indigo-300";
  const iconStyle = iconBgMap[accent] ?? "bg-indigo-400/10 text-indigo-300";

  return (
    <header className={cn("flex flex-col gap-5 border-b border-white/[0.07] px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between", className)}>
      <div>
        <div className="flex items-center gap-2">
          {icon && <span className={cn("grid h-7 w-7 place-items-center rounded-lg", iconStyle)}>{icon}</span>}
          <p className={cn("text-[10px] font-bold uppercase tracking-[0.16em]", eyeColor)}>{eyebrow}</p>
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-zinc-50">{title}</h2>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function DashboardSectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold tracking-[-0.03em] text-zinc-50", className)}>{children}</h2>;
}

export function DashboardSectionEyebrow({ children, accent = "indigo", className }: { children: ReactNode; accent?: string; className?: string }) {
  const color = accentMap[accent] ?? "text-indigo-300";
  return <p className={cn("text-[10px] font-bold uppercase tracking-[0.16em]", color, className)}>{children}</p>;
}
