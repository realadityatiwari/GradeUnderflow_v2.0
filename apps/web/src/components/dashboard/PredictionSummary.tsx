"use client";

import { PredictionData } from "@/lib/services/dashboard";
import { ArrowUpRight, Gauge, ShieldCheck, Target, TrendingUp } from "lucide-react";

function Detail({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-zinc-500">{icon}{label}</div>
      <div className="mt-1.5 text-sm font-semibold tabular-nums text-zinc-100">{value}</div>
    </div>
  );
}

export function PredictionSummary({ prediction, confidence = "MEDIUM" }: { prediction: PredictionData; confidence?: string }) {
  const current = prediction.sgpa.current;
  const target = prediction.sgpa.target;
  const progress = Math.min(100, Math.max(0, prediction.sgpa.progress));
  const gap = Math.max(0, target - current);
  const onTarget = gap <= 0;
  const trend = onTarget ? "On target" : gap <= 0.35 ? "Within reach" : "Recovery mode";
  const ring = { background: `conic-gradient(#7c8cff ${progress}%, rgba(255,255,255,0.08) 0)` };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-indigo-300/[0.18] bg-[radial-gradient(circle_at_92%_0%,rgba(124,140,255,0.22),transparent_34%),linear-gradient(145deg,rgba(31,35,64,0.92),rgba(9,9,11,0.94)_62%)] shadow-[0_20px_55px_-34px_rgba(0,0,0,1)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
      <header className="flex items-center justify-between px-5 pb-3 pt-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-200"><span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-300/15"><Gauge className="h-3.5 w-3.5" /></span>AI forecast</div>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">Prediction summary</h2>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${onTarget ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200" : "border-amber-300/25 bg-amber-300/10 text-amber-200"}`}>{trend}</span>
      </header>

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-5 border-y border-white/[0.08] py-4">
          <div className="grid h-[92px] w-[92px] shrink-0 place-items-center rounded-full p-1.5" style={ring}>
            <div className="grid h-full w-full place-items-center rounded-full bg-zinc-950/90 text-center shadow-inner">
              <div><p className="text-xl font-semibold leading-none tracking-[-0.06em] text-white tabular-nums">{current.toFixed(2)}</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-zinc-500">Forecast</p></div>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Predicted final SGPA</p>
            <p className="mt-1 text-sm font-medium leading-5 text-zinc-300">{onTarget ? "Your projection meets the semester target." : `${gap.toFixed(2)} SGPA points remain to reach target.`}</p>
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-indigo-200"><TrendingUp className="h-3.5 w-3.5" />{Math.round(progress)}% target progress</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Detail label="Target" value={target.toFixed(2)} icon={<Target className="h-3 w-3 text-indigo-300" />} />
          <Detail label="Gap" value={onTarget ? "Closed" : `${gap.toFixed(2)} pts`} icon={<ArrowUpRight className="h-3 w-3 text-amber-300" />} />
          <Detail label="Confidence" value={confidence} icon={<ShieldCheck className="h-3 w-3 text-emerald-300" />} />
          <Detail label="Required lift" value={onTarget ? "Maintain" : `+${gap.toFixed(2)}`} icon={<TrendingUp className="h-3 w-3 text-violet-300" />} />
        </div>
      </div>
    </section>
  );
}
