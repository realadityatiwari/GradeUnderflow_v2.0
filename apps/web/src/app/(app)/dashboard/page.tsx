"use client";

import { useEffect, useState } from "react";
import { dashboardService, DashboardResponse } from "@/lib/services/dashboard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { AcademicOverviewCards } from "@/components/dashboard/AcademicOverviewCards";
import { SubjectPerformanceChart } from "@/components/dashboard/SubjectPerformanceChart";
import { GradeDistributionChart } from "@/components/dashboard/GradeDistributionChart";
import { ActionCenter } from "@/components/dashboard/ActionCenter";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { PredictionSummary } from "@/components/dashboard/PredictionSummary";
import { EmptyState } from "@/components/Shell/EmptyState";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2, Rocket } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getDashboard()
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!dashboard || dashboard.setup_required) {
    return (
      <div className="mx-auto flex h-[80vh] max-w-[1440px] flex-col justify-center px-4 py-5 sm:px-6 lg:px-8">
        <EmptyState
          icon={<Rocket className="h-10 w-10 text-primary" />}
          title="Welcome to GradeUnderflow"
          description={dashboard?.next_step || "Start by creating your first semester."}
          action={
            <Button asChild>
              <Link href="/semesters">Get Started</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      {dashboard.header && (
        <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_84%_20%,rgba(124,140,255,0.16),transparent_32%),rgba(9,9,11,0.62)] px-5 py-5 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.9)] sm:px-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">Academic command center</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.055em] text-zinc-50 sm:text-4xl">
                {dashboard.header.greeting}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">A focused view of your projected semester outcome and the work that will move it.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-zinc-200"><span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />{dashboard.header.semester}</span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-2 text-xs font-semibold text-emerald-200"><CheckCircle2 className="h-3.5 w-3.5" />{dashboard.header.completion}% recorded</span>
              <ArrowUpRight className="hidden h-4 w-4 text-zinc-600 sm:block" />
            </div>
          </div>
        </header>
      )}

      {dashboard.overview && <AcademicOverviewCards data={dashboard.overview} />}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Main Content Area */}
        <div className="space-y-5 xl:col-span-8">
          {dashboard.charts && <SubjectPerformanceChart data={dashboard.charts} target={dashboard.prediction?.sgpa.target} />}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {dashboard.charts && <GradeDistributionChart data={dashboard.charts} />}
            {dashboard.semester && <ProgressOverview semester={dashboard.semester} />}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 xl:col-span-4">
          {dashboard.prediction && <PredictionSummary prediction={dashboard.prediction} confidence={dashboard.overview?.prediction_confidence} />}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-1">
            {dashboard.action_center && (
              <div className="min-h-[300px]">
                <ActionCenter
                  items={dashboard.action_center}
                  subjects={dashboard.subjects ?? []}
                  targetGap={dashboard.prediction ? Math.max(0, dashboard.prediction.sgpa.target - dashboard.prediction.sgpa.current) : 0}
                />
              </div>
            )}
            {dashboard.insights && (
              <div>
                <InsightsCard insights={dashboard.insights} />
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
