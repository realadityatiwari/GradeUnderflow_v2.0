import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 text-center shadow-sm", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.08),transparent_42%)] pointer-events-none" />
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
        {icon}
      </div>
      <h2 className="relative text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="relative mb-6 mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action && <div className="relative">{action}</div>}
    </div>
  );
}
