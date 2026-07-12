"use client";

import { useEffect, useState, useCallback } from "react";
import { PlusCircle, BookOpen } from "lucide-react";
import { Semester, semesterService } from "@/lib/services/semester";
import { SemesterCard } from "@/components/SemesterCard";
import { SemesterForm } from "@/components/SemesterForm";
import { Button } from "@/components/ui/button";
import { DashboardContainer } from "@/components/ds/DashboardContainer";
import { DashboardEmptyState } from "@/components/ds/DashboardEmptyState";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { LoadingState } from "@/components/Shell/LoadingState";

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);

  const fetchSemesters = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await semesterService.getSemesters();
      setSemesters(data);
    } catch (error) {
      console.error("Failed to load semesters:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);

  const handleCreate = () => {
    setEditingSemester(null);
    setIsFormOpen(true);
  };

  const handleEdit = (semester: Semester) => {
    setEditingSemester(semester);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this semester? All associated data will be lost.")) {
      try {
        await semesterService.deleteSemester(id);
        fetchSemesters();
      } catch (error) {
        console.error("Failed to delete semester:", error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingSemester) {
      await semesterService.updateSemester(editingSemester.id, data);
    } else {
      await semesterService.createSemester(data);
    }
    fetchSemesters();
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingState label="Loading your semesters" />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_84%_20%,rgba(124,140,255,0.16),transparent_32%),rgba(9,9,11,0.62)] px-5 py-5 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.9)] sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">Academic periods</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.055em] text-zinc-50 sm:text-4xl">
              Semesters
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">Manage your academic periods and their settings.</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 shrink-0">
            <PlusCircle className="h-4 w-4" />
            New Semester
          </Button>
        </div>
      </header>

      {semesters.length === 0 ? (
        <DashboardSurface className="flex min-h-[300px] items-center justify-center p-8">
          <DashboardEmptyState
            icon={<BookOpen className="h-10 w-10" />}
            title="No semesters found"
            description="Get started by creating your first semester. All your subjects, assessments, and attendance will be organized within semesters."
            action={<Button onClick={handleCreate}>Create your first Semester</Button>}
          />
        </DashboardSurface>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {semesters.map((semester) => (
            <SemesterCard
              key={semester.id}
              semester={semester}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <SemesterForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingSemester}
      />
    </DashboardContainer>
  );
}
