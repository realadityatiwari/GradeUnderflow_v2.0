import { DashboardMetricCard, DashboardGrid } from "@/components/ds";
import { SemesterAnalyticsData, SubjectAnalyticsData } from "@/lib/services/analytics";
import { Award, Target, Activity, BookOpen } from "lucide-react";

interface AnalyticsOverviewProps {
  semester: SemesterAnalyticsData | null;
  subject: SubjectAnalyticsData | null;
}

export function AnalyticsOverview({ semester, subject }: AnalyticsOverviewProps) {
  if (!semester || !subject) return null;

  const completion = semester.completion_percentage;
  const completionAccent = completion >= 70 ? "from-emerald-400 to-teal-500" : completion >= 40 ? "from-amber-400 to-orange-500" : "from-rose-400 to-red-500";

  return (
    <DashboardGrid columns={4}>
      <DashboardMetricCard
        label="Average Grade"
        value={subject.average_grade}
        detail={`Across ${subject.total_credits} credits`}
        icon={<Award className="h-4 w-4" />}
        accent="from-indigo-400 to-violet-500"
        progress={(subject.average_percentage ?? 0)}
        footer={<span>Grade performance</span>}
      />
      <DashboardMetricCard
        label="Avg Percentage"
        value={`${subject.average_percentage.toFixed(1)}%`}
        detail="Overall performance"
        icon={<Target className="h-4 w-4" />}
        accent="from-sky-400 to-blue-600"
        progress={subject.average_percentage}
        footer={<span>Score trajectory</span>}
      />
      <DashboardMetricCard
        label="Completion"
        value={`${completion.toFixed(0)}%`}
        detail="Assessment progress"
        icon={<Activity className="h-4 w-4" />}
        accent={completionAccent}
        progress={completion}
        footer={<span>{completion >= 70 ? "On track" : "Needs attention"}</span>}
      />
      <DashboardMetricCard
        label="Pass / Fail"
        value={
          <>
            <span className="text-emerald-300">{semester.passed_subjects}</span>
            <span className="mx-1 text-lg font-medium tracking-normal text-zinc-600">/</span>
            <span className="text-rose-300">{semester.failed_subjects}</span>
          </>
        }
        detail="Predicted outcomes"
        icon={<BookOpen className="h-4 w-4" />}
        accent="from-fuchsia-400 to-pink-500"
        progress={semester.passed_subjects + semester.failed_subjects > 0
          ? (semester.passed_subjects / (semester.passed_subjects + semester.failed_subjects)) * 100
          : 0}
        footer={<span>Pass rate</span>}
      />
    </DashboardGrid>
  );
}
