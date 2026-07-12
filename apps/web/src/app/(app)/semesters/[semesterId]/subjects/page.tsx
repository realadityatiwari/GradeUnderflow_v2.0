"use client";

import { useEffect, useState, useCallback, use } from "react";
import { PlusCircle, BookOpen, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { Subject, subjectService } from "@/lib/services/subject";
import { Semester, semesterService } from "@/lib/services/semester";
import { SubjectCard } from "@/components/SubjectCard";
import { SubjectForm } from "@/components/SubjectForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardContainer } from "@/components/ds/DashboardContainer";
import { DashboardEmptyState } from "@/components/ds/DashboardEmptyState";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { LoadingState } from "@/components/Shell/LoadingState";
import { SGPASection } from "@/components/SGPASection";
import { AcademicHealthCard } from "@/components/Prediction/AcademicHealthCard";
import { TargetSGPACard } from "@/components/Prediction/TargetSGPACard";
import { ImprovementOpportunitiesCard } from "@/components/Prediction/ImprovementOpportunitiesCard";

export default function SubjectsPage({ params }: { params: Promise<{ semesterId: string }> }) {
  const { semesterId } = use(params);
  
  const [semester, setSemester] = useState<Semester | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [semData, subData] = await Promise.all([
        semesterService.getSemester(semesterId),
        subjectService.getSubjects(semesterId)
      ]);
      setSemester(semData);
      setSubjects(subData);
    } catch (error) {
      console.error("Failed to load subjects:", error);
      setError("Failed to load subjects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [semesterId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingSubject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subject? All associated data will be lost.")) {
      try {
        await subjectService.deleteSubject(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete subject:", error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingSubject) {
      await subjectService.updateSubject(editingSubject.id, data);
    } else {
      await subjectService.createSubject(semesterId, data);
    }
    fetchData();
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingState label="Loading your subjects" />
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardSurface className="flex min-h-[300px] items-center justify-center p-8 text-center text-rose-400">
          <p>{error}</p>
        </DashboardSurface>
      </DashboardContainer>
    );
  }

  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardContainer>
      <div className="mb-1">
        <Button variant="ghost" asChild className="-ml-3 text-zinc-400 hover:text-zinc-200">
          <Link href="/semesters">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Semesters
          </Link>
        </Button>
      </div>

      <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_84%_20%,rgba(124,140,255,0.16),transparent_32%),rgba(9,9,11,0.62)] px-5 py-5 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.9)] sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">Course catalog</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.055em] text-zinc-50 sm:text-4xl">
              Subjects {semester ? <span className="text-zinc-500">— {semester.name}</span> : ""}
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">Manage your courses for this semester.</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search subjects..."
                className="pl-8 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleCreate} className="gap-2 shrink-0">
              <PlusCircle className="h-4 w-4" />
              New Subject
            </Button>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <AcademicHealthCard semesterId={semesterId} />
          <SGPASection semesterId={semesterId} />
        </div>
        <div className="space-y-5 xl:col-span-4">
          <ImprovementOpportunitiesCard semesterId={semesterId} />
          <TargetSGPACard semesterId={semesterId} />
        </div>
      </div>

      {subjects.length === 0 ? (
        <DashboardSurface className="flex min-h-[300px] items-center justify-center p-8">
          <DashboardEmptyState
            icon={<BookOpen className="h-10 w-10" />}
            title="No subjects found"
            description="Get started by adding your first subject."
            action={<Button onClick={handleCreate}>Add your first Subject</Button>}
          />
        </DashboardSurface>
      ) : filteredSubjects.length === 0 ? (
        <DashboardSurface className="flex min-h-[200px] items-center justify-center p-8">
          <p className="text-sm text-zinc-500">No subjects match your search.</p>
        </DashboardSurface>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      <SubjectForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSubmit={handleFormSubmit}
        initialData={editingSubject}
      />
    </DashboardContainer>
  );
}
