import { Skeleton } from "@/components/ui/skeleton";

function Surface({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return <div className={`overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-950/65 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.9)] ${className}`}>{children}</div>;
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <Surface className="p-5 sm:p-6">
        <Skeleton className="h-3 w-40 bg-white/[0.06]" />
        <Skeleton className="mt-3 h-10 w-72 max-w-full bg-white/[0.08]" />
        <Skeleton className="mt-3 h-4 w-[28rem] max-w-full bg-white/[0.05]" />
      </Surface>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Surface key={index} className="min-h-[172px] p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="h-3 w-24 bg-white/[0.06]" />
              <Skeleton className="h-10 w-10 rounded-xl bg-white/[0.08]" />
            </div>
            <Skeleton className="mt-5 h-10 w-24 bg-white/[0.1]" />
            <Skeleton className="mt-6 h-3 w-36 bg-white/[0.05]" />
            <Skeleton className="mt-2 h-1.5 w-full rounded-full bg-white/[0.06]" />
          </Surface>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <Surface className="h-[500px] p-6">
            <Skeleton className="h-3 w-36 bg-white/[0.06]" />
            <Skeleton className="mt-3 h-7 w-56 bg-white/[0.09]" />
            <Skeleton className="mt-9 h-[330px] w-full bg-white/[0.035]" />
          </Surface>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Surface className="h-[350px] p-5">
              <Skeleton className="h-5 w-40 bg-white/[0.07]" />
              <Skeleton className="mx-auto mt-8 h-40 w-40 rounded-full bg-white/[0.06]" />
            </Surface>
            <Surface className="h-[350px] p-5">
              <Skeleton className="h-5 w-40 bg-white/[0.07]" />
              <Skeleton className="mx-auto mt-8 h-40 w-40 rounded-full bg-white/[0.06]" />
            </Surface>
          </div>
        </div>
        <div className="space-y-5 xl:col-span-4">
          <Surface className="min-h-[300px] p-5">
            <Skeleton className="h-5 w-36 bg-white/[0.07]" />
            <Skeleton className="mt-6 h-20 w-full bg-white/[0.04]" />
            <Skeleton className="mt-3 h-20 w-full bg-white/[0.04]" />
          </Surface>
        </div>
      </div>
    </div>
  );
}
