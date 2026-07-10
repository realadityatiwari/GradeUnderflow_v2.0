"use client";

import { useEffect, useState, useCallback, use } from "react";
import { PlusCircle, Loader2, ArrowLeft, Target } from "lucide-react";
import Link from "next/link";
import { Subject, subjectService } from "@/lib/services/subject";
import { Assessment, AssessmentType, assessmentService } from "@/lib/services/assessment";
import { AssessmentCard } from "@/components/AssessmentCard";
import { AssessmentForm } from "@/components/AssessmentForm";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/Shell/EmptyState";

const TYPE_LABELS: Record<AssessmentType, string> = {
  [AssessmentType.ASSIGNMENT]: "Assignments",
  [AssessmentType.QUIZ]: "Quizzes",
  [AssessmentType.SURPRISE_TEST]: "Surprise Tests",
  [AssessmentType.PRE_END]: "Pre-End Examination",
  [AssessmentType.END_SEMESTER]: "End Semester Examination",
};

export default function AssessmentsPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subjData, assessData] = await Promise.all([
        subjectService.getSubject(subjectId),
        assessmentService.getAssessments(subjectId)
      ]);
      setSubject(subjData);
      setAssessments(assessData);
    } catch (error) {
      console.error("Failed to load assessments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingAssessment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assessment? The result will also be permanently deleted.")) {
      try {
        await assessmentService.deleteAssessment(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete assessment:", error);
      }
    }
  };

  const handleDefSubmit = async (data: any) => {
    if (editingAssessment) {
      await assessmentService.updateAssessment(editingAssessment.id, data);
    } else {
      await assessmentService.createAssessment(subjectId, data);
    }
    fetchData();
  };

  const handleResSubmit = async (data: any) => {
    if (editingAssessment) {
      await assessmentService.updateResult(editingAssessment.id, data);
    }
    fetchData();
  };

  const renderSection = (type: AssessmentType) => {
    const filtered = assessments.filter(a => a.assessment_type === type);
    if (filtered.length === 0) return null;

    return (
      <AccordionItem value={type} key={type} className="border-b-0 mb-4 bg-card rounded-lg border shadow-sm px-4">
        <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
          <div className="flex items-center gap-2">
            {TYPE_LABELS[type]}
            <span className="text-muted-foreground text-sm font-normal bg-secondary px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(assessment => (
              <AssessmentCard 
                key={assessment.id}
                assessment={assessment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
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
      <div className="mb-6">
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground mb-2">
          <Link href={subject ? `/semesters/${subject.semester_id}/subjects` : "/semesters"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Academic Activity Engine
          </h1>
          <p className="text-muted-foreground mt-1">
            {subject ? `${subject.code} - ${subject.name}` : "Manage assessments"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreate} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Assessment
          </Button>
        </div>
      </div>

      {assessments.length === 0 ? (
        <EmptyState
          icon={<Target className="h-10 w-10 text-primary" />}
          title="No active assessments"
          description="Track your assignments, quizzes, and exams to stay on top of your grades."
          action={<Button onClick={handleCreate}>Add first assessment</Button>}
          className="mt-8"
        />
      ) : (
        <Accordion type="multiple" defaultValue={Object.values(AssessmentType)} className="w-full space-y-4">
          {Object.values(AssessmentType).map(type => renderSection(type as AssessmentType))}
        </Accordion>
      )}

      <AssessmentForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSubmitDefinition={handleDefSubmit}
        onSubmitResult={handleResSubmit}
        initialData={editingAssessment}
      />
    </div>
  );
}
