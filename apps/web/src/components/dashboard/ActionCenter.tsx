"use client";

import { ActionItem, PriorityEnum, SubjectSummary } from "@/lib/services/dashboard";
import { ArrowUpRight, Check, ChevronRight, CircleAlert, ListTodo, Sparkles } from "lucide-react";
import Link from "next/link";

const priorityStyle: Record<PriorityEnum, { label: string; tone: string; impact: number }> = {
  CRITICAL: { label: "Urgent", tone: "border-rose-300/20 bg-rose-300/10 text-rose-200", impact: 0.4 },
  HIGH: { label: "High", tone: "border-amber-300/20 bg-amber-300/10 text-amber-200", impact: 0.25 },
  MEDIUM: { label: "Medium", tone: "border-sky-300/20 bg-sky-300/10 text-sky-200", impact: 0.12 },
  LOW: { label: "Low", tone: "border-zinc-300/15 bg-zinc-300/[0.08] text-zinc-300", impact: 0.06 },
};

function resolveSubject(item: ActionItem, subjects: SubjectSummary[]) {
  const subjectId = item.link?.match(/\/subjects\/([^/]+)/)?.[1];
  const subject = subjects.find((candidate) => candidate.id === subjectId);
  return subject ? `${subject.code} · ${subject.name}` : "Course assessment";
}

export function ActionCenter({ items, subjects = [], targetGap = 0 }: { items: ActionItem[]; subjects?: SubjectSummary[]; targetGap?: number }) {
  if (!items || items.length === 0) {
    return (
      <section className="relative grid h-full min-h-[280px] place-items-center overflow-hidden rounded-2xl border border-emerald-300/[0.14] bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.11),transparent_45%),rgba(9,9,11,0.72)] px-6 py-8 text-center shadow-[0_18px_45px_-30px_rgba(0,0,0,0.95)]">
        <div className="max-w-[260px]">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200"><Check className="h-5 w-5" /></span>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300">Action center clear</p>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Nothing is competing for your attention.</h2>
          <p className="mt-2 text-xs leading-5 text-zinc-500">Your recorded assessments are current. Keep the momentum going.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.95)]">
      <header className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">Ranked next steps</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Action center <span className="text-zinc-600">· {items.length}</span></h2>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400/10 text-amber-300"><ListTodo className="h-4 w-4" /></span>
      </header>

      <div className="divide-y divide-white/[0.07]">
        {items.map((item, index) => {
          const priority = priorityStyle[item.priority];
          const estimatedLift = targetGap > 0 ? Math.min(targetGap, priority.impact).toFixed(2) : null;
          return (
            <Link key={`${item.title}-${index}`} href={item.link || "#"} className="group relative block px-5 py-4 transition-colors hover:bg-white/[0.035]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-[10px] font-bold text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13px] font-semibold leading-5 text-zinc-100">{item.title}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${priority.tone}`}>{priority.label}</span>
                  </div>
                  <p className="mt-1 truncate text-[11px] font-medium text-indigo-200/80">{resolveSubject(item, subjects)}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{item.reason}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-[10px] font-semibold">
                    <span className="inline-flex items-center gap-1 text-zinc-400"><CircleAlert className="h-3 w-3" />{priority.label} urgency</span>
                    {estimatedLift ? (
                      <span className="inline-flex items-center gap-1 text-emerald-300"><Sparkles className="h-3 w-3" />Est. SGPA lift +{estimatedLift}</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-300"><Check className="h-3 w-3" />Target secured</span>
                    )}
                  </div>
                </div>
                <span className="mt-1 flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-[0.11em] text-indigo-200 opacity-70 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"><span className="hidden sm:inline">{item.action}</span><ArrowUpRight className="h-3.5 w-3.5" /></span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.018] px-5 py-3 text-[10px] text-zinc-500"><span>Impact estimates are directional</span><ChevronRight className="h-3.5 w-3.5" /></div>
    </section>
  );
}
