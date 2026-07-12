import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: ReactNode;
  className?: string;
}

export function DashboardContainer({ children, className }: DashboardContainerProps) {
  return (
    <div className={cn("mx-auto max-w-[1440px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 animate-in fade-in duration-500", className)}>
      {children}
    </div>
  );
}
