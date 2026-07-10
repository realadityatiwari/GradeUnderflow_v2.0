"use client";

import { useEffect, useState, useCallback } from "react";
import { PlusCircle, Loader2, BookOpen } from "lucide-react";
import { Semester, semesterService } from "@/lib/services/semester";
import { SemesterCard } from "@/components/SemesterCard";
import { SemesterForm } from "@/components/SemesterForm";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/Shell/EmptyState";

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog State
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
        fetchSemesters(); // Refresh list
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
    fetchSemesters(); // Refresh list
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Semesters</h1>
          <p className="text-muted-foreground mt-1">Manage your academic periods and their settings.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New Semester
        </Button>
      </div>

      {semesters.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-10 w-10 text-primary" />}
          title="No semesters found"
          description="Get started by creating your first semester. All your subjects, assessments, and attendance will be organized within semesters."
          action={<Button onClick={handleCreate}>Create your first Semester</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
