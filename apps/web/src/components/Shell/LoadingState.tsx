import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading your workspace" }: { label?: string }) {
  return (
    <div className="grid min-h-[42vh] place-items-center">
      <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-zinc-950/70 px-4 py-3 text-sm font-medium text-zinc-400 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.9)]">
        <Loader2 className="h-4 w-4 animate-spin text-indigo-300" />
        {label}
      </div>
    </div>
  );
}
