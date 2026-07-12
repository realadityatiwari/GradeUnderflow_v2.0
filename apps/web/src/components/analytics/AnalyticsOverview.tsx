import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SemesterAnalyticsData, SubjectAnalyticsData } from "@/lib/services/analytics";
import { Award, Target, BookOpen, Activity } from "lucide-react";

interface AnalyticsOverviewProps {
  semester: SemesterAnalyticsData | null;
  subject: SubjectAnalyticsData | null;
}

export function AnalyticsOverview({ semester, subject }: AnalyticsOverviewProps) {
  if (!semester || !subject) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card className="relative overflow-hidden border-primary/20 bg-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-[13px] font-semibold tracking-wide text-primary uppercase">Average Grade</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Award className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{subject.average_grade}</div>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Across {subject.total_credits} credits
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">Avg Percentage</CardTitle>
          <div className="p-2 bg-secondary rounded-full">
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tabular-nums tracking-tight">{subject.average_percentage.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Overall performance
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">Completion</CardTitle>
          <div className="p-2 bg-secondary rounded-full">
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tabular-nums tracking-tight">{semester.completion_percentage.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Assessment progress
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">Pass / Fail</CardTitle>
          <div className="p-2 bg-secondary rounded-full">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tabular-nums tracking-tight flex items-baseline gap-1">
            <span className="text-emerald-500">{semester.passed_subjects}</span>
            <span className="text-muted-foreground/30 font-light text-xl">/</span>
            <span className="text-rose-500">{semester.failed_subjects}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Predicted outcomes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
