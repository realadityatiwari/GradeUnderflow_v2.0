import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function DashboardGrid({ children, className, columns = 4 }: DashboardGridProps) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  };

  return <div className={cn("grid grid-cols-1 gap-4", cols[columns], className)}>{children}</div>;
}
