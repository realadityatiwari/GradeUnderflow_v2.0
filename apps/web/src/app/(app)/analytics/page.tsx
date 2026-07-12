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
import { EmptyState } from "@/components/Shell/EmptyState";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineChart } from "@/components/analytics/TimelineChart";
import { HeatmapChart } from "@/components/analytics/HeatmapChart";

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
      <div className="container mx-auto py-10">
        <AnalyticsSkeleton />
      </div>
    );
  }

  if (!overview || !overview.has_data) {
    return (
      <div className="container mx-auto py-10 h-[80vh] flex flex-col justify-center">
        <EmptyState
          icon={<BarChart3 className="h-10 w-10 text-primary" />}
          title="Analytics Unavailable"
          description={overview?.message || "Create your first semester to unlock analytics."}
          action={
            <Button asChild>
              <Link href="/semesters">Create Semester</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Analytics</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Deep dive into your performance patterns and historical insights.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none">
          <TabsTrigger value="overview" className="data-[state=active]:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Overview</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Trends & Timelines</TabsTrigger>
          <TabsTrigger value="comparisons" className="data-[state=active]:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Comparisons</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {overview.overview && (
            <AnalyticsOverview semester={overview.overview.semester} subject={overview.overview.subject} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {trends?.data && <TrendChart data={trends.data} />}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {distribution?.data && <DistributionChart data={distribution.data} />}
                {comparison?.data && <RadarPerformanceChart data={comparison.data} />}
              </div>
            </div>

            <div className="space-y-6">
              <ImprovementAnalysisCard items={overview.improvements} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          {trends?.data && <TrendChart data={trends.data} />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TimelineChart />
            <HeatmapChart />
          </div>
        </TabsContent>

        <TabsContent value="comparisons" className="space-y-6 mt-6">
          {comparison?.data && <ComparisonChart data={comparison.data} />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparison?.data && <RadarPerformanceChart data={comparison.data} />}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
