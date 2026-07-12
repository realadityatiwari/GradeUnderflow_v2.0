"use client";

import { StructuredInsight } from "@/lib/services/dashboard";
import { ArrowUpRight, Lightbulb, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

const insightStyle = {
  success: { icon: ShieldCheck, accent: "text-emerald-300", edge: "border-emerald-300/15", surface: "bg-emerald-300/[0.045]" },
  warning: { icon: TriangleAlert, accent: "text-amber-300", edge: "border-amber-300/15", surface: "bg-amber-300/[0.045]" },
  critical: { icon: TriangleAlert, accent: "text-rose-300", edge: "border-rose-300/15", surface: "bg-rose-300/[0.045]" },
  info: { icon: Sparkles, accent: "text-indigo-300", edge: "border-indigo-300/15", surface: "bg-indigo-300/[0.045]" },
};

export function InsightsCard({ insights }: { insights: StructuredInsight[] }) {
  if (!insights || insights.length === 0) return null;

  return (
    <section className="h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.95)]">
      <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">Signal feed</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">AI insights</h2>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-400/10 text-indigo-300"><Lightbulb className="h-4 w-4" /></span>
      </header>

      <div className="grid gap-2.5 p-3">
        {insights.map((insight, index) => {
          const style = insightStyle[insight.type] ?? insightStyle.info;
          const Icon = style.icon;
          return (
            <article key={`${insight.title}-${index}`} className={`group rounded-xl border ${style.edge} ${style.surface} p-3.5 transition-colors hover:bg-white/[0.055]`}>
              <div className="flex gap-3">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-950/50 ${style.accent}`}><Icon className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13px] font-semibold leading-5 text-zinc-100">{insight.title}</h3>
                    {insight.subject && <span className="rounded-md border border-white/[0.08] bg-zinc-950/45 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.11em] text-zinc-400">{insight.subject}</span>}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">{insight.message}</p>
                  {insight.action && <p className={`mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] ${style.accent}`}><ArrowUpRight className="h-3 w-3" />{insight.action}</p>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
