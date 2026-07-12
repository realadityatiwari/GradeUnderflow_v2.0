import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  back?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow = "Academic workspace", title, description, action, back, meta, className }: PageHeaderProps) {
  return (
    <header className={cn("relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_88%_18%,rgba(124,140,255,0.15),transparent_32%),rgba(9,9,11,0.68)] px-5 py-5 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.9)] sm:px-6", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent" />
      {back && <div className="relative mb-4">{back}</div>}
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.055em] text-zinc-50 sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
          {meta && <div className="mt-3">{meta}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
