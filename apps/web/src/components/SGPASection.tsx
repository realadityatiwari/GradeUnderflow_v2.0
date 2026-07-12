"use client";

import { useEffect, useState } from "react";
import { SGPACalculationResponse, sgpaService } from "@/lib/services/sgpa";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { DashboardMetricCard, DashboardGrid } from "@/components/ds";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Award, Loader2 } from "lucide-react";

export function SGPASection({ semesterId }: { semesterId: string }) {
  const [data, setData] = useState<SGPACalculationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSGPA = async () => {
      try {
        const response = await sgpaService.getSGPA(semesterId);
        setData(response);
      } catch (error) {
        console.error("Failed to load SGPA", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSGPA();
  }, [semesterId]);

  if (isLoading) {
    return (
      <DashboardSurface className="flex min-h-[160px] items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-300" />
      </DashboardSurface>
    );
  }

  if (!data) return null;

  const { semester, subjects } = data;

  return (
    <div className="space-y-5">
      <DashboardGrid columns={3}>
        <DashboardMetricCard
          label="Semester SGPA"
          value={semester.sgpa.toFixed(2)}
          detail="Academic Performance"
          icon={<Award className="h-4 w-4" />}
          accent="from-indigo-400 to-violet-500"
          progress={semester.sgpa * 10}
          footer={<span>Based on {subjects.length} subjects</span>}
        />
        <DashboardMetricCard
          label="Total Credits"
          value={semester.total_credits}
          detail="Registered Credits"
          icon={<BookOpen className="h-4 w-4" />}
          accent="from-sky-400 to-blue-600"
          progress={Math.min(100, (semester.total_credits / 30) * 100)}
          footer={<span>Credit load</span>}
        />
        <DashboardMetricCard
          label="Credit Points"
          value={semester.earned_credit_points}
          detail="Earned Points"
          icon={<GraduationCap className="h-4 w-4" />}
          accent="from-fuchsia-400 to-pink-500"
          progress={Math.min(100, (semester.earned_credit_points / 300) * 100)}
          footer={<span>Total accumulation</span>}
        />
      </DashboardGrid>

      <DashboardSurface>
        <header className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">Detailed breakdown</p>
            <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-50">Subject Breakdown</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Detailed view of credits and grades per subject</p>
          </div>
        </header>
        <div className="p-5 sm:px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead className="text-center">Grade Point</TableHead>
                <TableHead className="text-right">Credit Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium text-zinc-200">{subject.code}</TableCell>
                  <TableCell className="text-zinc-200">{subject.name}</TableCell>
                  <TableCell className="text-center text-zinc-300">{subject.credits}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={subject.grade === "F" ? "destructive" : "secondary"}>
                      {subject.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-zinc-300">{subject.grade_point}</TableCell>
                  <TableCell className="text-right font-medium text-zinc-200">
                    {subject.credit_points}
                  </TableCell>
                </TableRow>
              ))}
              {subjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                    No subjects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DashboardSurface>
    </div>
  );
}
