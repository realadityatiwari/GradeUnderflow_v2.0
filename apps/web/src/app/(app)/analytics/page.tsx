"use client";

import { useEffect, useState } from "react";
import { 
  analyticsService, 
  AnalyticsOverviewResponse,
  TrendAnalyticsResponse,
  DistributionAnalyticsResponse,
  ComparisonAnalyticsResponse
} from "@/lib/services/analytics";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { TrendChart } from "@/components/analytics/TrendChart";
import { DistributionChart } from "@/components/analytics/DistributionChart";
import { ComparisonChart } from "@/components/analytics/ComparisonChart";
import { RadarPerformanceChart } from "@/components/analytics/RadarPerformanceChart";
import { ImprovementAnalysisCard } from "@/components/analytics/ImprovementAnalysisCard";
import { DashboardContainer } from "@/components/ds/DashboardContainer";
import { DashboardEmptyState } from "@/components/ds/DashboardEmptyState";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { TimelineChart } from "@/components/analytics/TimelineChart";
import { HeatmapChart } from "@/components/analytics/HeatmapChart";
import Link from "next/link";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverviewResponse | null>(null);
  const [trends, setTrends] = useState<TrendAnalyticsResponse | null>(null);
  const [distribution, setDistribution] = useState<DistributionAnalyticsResponse | null>(null);
  const [comparison, setComparison] = useState<ComparisonAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.getOverview(),
      analyticsService.getTrends(),
      analyticsService.getDistribution(),
      analyticsService.getComparison()
    ]).then(([ov, tr, di, co]) => {
      setOverview(ov);
      setTrends(tr);
      setDistribution(di);
      setComparison(co);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardContainer>
        <AnalyticsSkeleton />
      </DashboardContainer>
    );
  }

  if (!overview || !overview.has_data) {
    return (
      <DashboardContainer>
        <div className="flex h-[80vh] flex-col justify-center">
          <DashboardSurface className="flex min-h-[300px] items-center justify-center p-8">
            <DashboardEmptyState
              icon={<BarChart3 className="h-10 w-10" />}
              title="Analytics Unavailable"
              description={overview?.message || "Create your first semester to unlock analytics."}
              action={
                <Button asChild>
                  <Link href="/semesters">Create Semester</Link>
                </Button>
              }
            />
          </DashboardSurface>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_88%_18%,rgba(124,140,255,0.15),transparent_32%),rgba(9,9,11,0.68)] px-5 py-5 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.9)] sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
              Deep analytics suite
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.055em] text-zinc-50 sm:text-4xl">
              Academic Analytics
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Deep dive into your performance patterns and historical insights.
            </p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends & Timelines</TabsTrigger>
          <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-5 mt-0">
          {overview.overview && (
            <AnalyticsOverview semester={overview.overview.semester} subject={overview.overview.subject} />
          )}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="space-y-5 xl:col-span-8">
              {trends?.data && <TrendChart data={trends.data} />}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {distribution?.data && <DistributionChart data={distribution.data} />}
                {comparison?.data && <RadarPerformanceChart data={comparison.data} />}
              </div>
            </div>

            <div className="space-y-5 xl:col-span-4">
              <ImprovementAnalysisCard items={overview.improvements} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-5 mt-0">
          {trends?.data && <TrendChart data={trends.data} />}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <TimelineChart />
            <HeatmapChart />
          </div>
        </TabsContent>

        <TabsContent value="comparisons" className="space-y-5 mt-0">
          {comparison?.data && <ComparisonChart data={comparison.data} />}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {comparison?.data && <RadarPerformanceChart data={comparison.data} />}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardContainer>
  );
}
