"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HeatmapChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
        <CardDescription>Assessment density over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent)] pointer-events-none" />
          <div className="text-center max-w-[250px]">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-white/5 bg-white/[0.02] text-zinc-500 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
            </div>
            <p className="text-sm font-semibold text-zinc-300">Heatmap coming soon</p>
            <p className="text-xs text-muted-foreground mt-1">Visualize your assessment density and workload over time.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
