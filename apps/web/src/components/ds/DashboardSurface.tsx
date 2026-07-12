import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardSurfaceProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  accent?: string;
}

export function DashboardSurface({ children, className, hover = false, accent }: DashboardSurfaceProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.95)]",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-zinc-900/80",
        className
      )}
    >
      {accent && <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent")} />}
      {children}
    </article>
  );
}

export function DashboardCard({ children, className, hover = true }: DashboardSurfaceProps) {
  return (
    <DashboardSurface className={cn("p-5", className)} hover={hover}>
      {children}
    </DashboardSurface>
  );
}
