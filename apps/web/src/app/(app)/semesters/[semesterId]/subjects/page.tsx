"use client";

import { useEffect, useState, useCallback, use } from "react";
import { PlusCircle, Loader2, BookOpen, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { Subject, subjectService } from "@/lib/services/subject";
import { Semester, semesterService } from "@/lib/services/semester";
import { SubjectCard } from "@/components/SubjectCard";
import { SubjectForm } from "@/components/SubjectForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/Shell/EmptyState";

export default function SubjectsPage({ params }: { params: Promise<{ semesterId: string }> }) {
  const { semesterId } = use(params);
  
  const [semester, setSemester] = useState<Semester | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [semData, subData] = await Promise.all([
        semesterService.getSemester(semesterId),
        subjectService.getSubjects(semesterId)
      ]);
      setSemester(semData);
      setSubjects(subData);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [semesterId]);

  useEffect(() => {
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
        fetchData(); // Refresh list
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
    fetchData(); // Refresh list
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground mb-2">
          <Link href="/semesters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Semesters
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Subjects {semester ? `— ${semester.name}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">Manage your courses for this semester.</p>
        </div>
        <div className="flex w-full md:w-auto items-center space-x-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subjects..."
              className="pl-8"
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

      {subjects.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-10 w-10 text-primary" />}
          title="No subjects found"
          description="Get started by adding your first subject."
          action={<Button onClick={handleCreate}>Add your first Subject</Button>}
          className="mt-8"
        />
      ) : filteredSubjects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No subjects match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
