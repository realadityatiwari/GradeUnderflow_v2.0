"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TimelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Timeline</CardTitle>
        <CardDescription>Major milestones and assessment dates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent)] pointer-events-none" />
          <div className="text-center max-w-[250px]">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-white/5 bg-white/[0.02] text-zinc-500 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m8 6 4-4 4 4"/><path d="m8 18 4 4 4-4"/></svg>
            </div>
            <p className="text-sm font-semibold text-zinc-300">Timeline view coming soon</p>
            <p className="text-xs text-muted-foreground mt-1">A chronological breakdown of your academic milestones.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
