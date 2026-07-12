"use client";

import { useEffect, useState, useCallback, use } from "react";
import { PlusCircle, ArrowLeft, Target, Loader2 } from "lucide-react";
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
import { DashboardContainer } from "@/components/ds/DashboardContainer";
import { DashboardEmptyState } from "@/components/ds/DashboardEmptyState";
import { DashboardSurface } from "@/components/ds/DashboardSurface";
import { EvaluationSection } from "@/components/EvaluationSection";
import { PredictionCard } from "@/components/Prediction/PredictionCard";

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
      <AccordionItem value={type} key={type}>
        <AccordionTrigger className="px-5 py-4">
          <div className="flex items-center gap-2">
            {TYPE_LABELS[type]}
            <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
              {filtered.length}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(assessment => (
              <AssessmentCard 
                key={assessment.id}
                assessment={assessment}
                semesterId={subject?.semester_id}
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
      <DashboardContainer>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-300" />
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <div className="mb-1">
        <Button variant="ghost" asChild className="-ml-3 text-zinc-400 hover:text-zinc-200">
          <Link href={subject ? `/semesters/${subject.semester_id}/subjects` : "/semesters"}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Subjects
          </Link>
        </Button>
      </div>

      <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_84%_20%,rgba(124,140,255,0.16),transparent_32%),rgba(9,9,11,0.62)] px-5 py-5 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.9)] sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">Academic activity engine</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.055em] text-zinc-50 sm:text-4xl">
              Academic Activity Engine
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {subject ? `${subject.code} - ${subject.name}` : "Manage assessments"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreate} className="gap-2 shrink-0">
              <PlusCircle className="h-4 w-4" />
              New Assessment
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <EvaluationSection subjectId={subjectId} />
        </div>
        <div className="space-y-5 xl:col-span-4">
          <PredictionCard subjectId={subjectId} />
        </div>
      </div>

      {assessments.length === 0 ? (
        <DashboardSurface className="flex min-h-[300px] items-center justify-center p-8">
          <DashboardEmptyState
            icon={<Target className="h-10 w-10" />}
            title="No active assessments"
            description="Track your assignments, quizzes, and exams to stay on top of your grades."
            action={<Button onClick={handleCreate}>Add first assessment</Button>}
          />
        </DashboardSurface>
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
    </DashboardContainer>
  );
}
