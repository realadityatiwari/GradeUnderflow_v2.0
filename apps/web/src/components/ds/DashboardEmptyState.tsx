import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function DashboardEmptyState({ icon, title, description, action, className }: DashboardEmptyStateProps) {
  return (
    <div className={cn("grid min-h-[300px] place-items-center px-6 py-10", className)}>
      <div className="max-w-sm text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-400">
          {icon}
        </span>
        <h3 className="mt-4 text-base font-semibold text-zinc-100">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
