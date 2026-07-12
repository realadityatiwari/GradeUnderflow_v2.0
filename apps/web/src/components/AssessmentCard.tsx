import { Pencil, Trash, FileText, CheckCircle2, Clock, CircleDashed } from "lucide-react";
import { Assessment, AssessmentStatus } from "@/lib/services/assessment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { WhatIfDialog } from "@/components/Prediction/WhatIfDialog";

interface AssessmentCardProps {
  assessment: Assessment;
  semesterId?: string;
  onEdit: (assessment: Assessment) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; style: string }> = {
  [AssessmentStatus.CHECKED]: {
    label: "Graded",
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    style: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  },
  [AssessmentStatus.SUBMITTED]: {
    label: "Submitted",
    icon: <FileText className="h-3.5 w-3.5 text-sky-400" />,
    style: "border-sky-300/20 bg-sky-300/10 text-sky-200",
  },
  [AssessmentStatus.IN_PROGRESS]: {
    label: "In Progress",
    icon: <Clock className="h-3.5 w-3.5 text-amber-400" />,
    style: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  },
  [AssessmentStatus.NOT_STARTED]: {
    label: "Not Started",
    icon: <CircleDashed className="h-3.5 w-3.5 text-zinc-500" />,
    style: "border-zinc-300/15 bg-zinc-300/[0.08] text-zinc-300",
  },
};

export function AssessmentCard({ assessment, semesterId, onEdit, onDelete }: AssessmentCardProps) {
  const result = assessment.result;
  const status = result?.status || AssessmentStatus.NOT_STARTED;
  const cfg = statusConfig[status] ?? statusConfig[AssessmentStatus.NOT_STARTED];

  return (
    <article className="group relative min-h-[188px] overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/65 p-5 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-zinc-900/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-fuchsia-400 to-pink-500" />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.025] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-white/[0.08] bg-zinc-950/45 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.11em] text-zinc-400">
              {assessment.assessment_category}
            </span>
            <span className={`rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] inline-flex items-center gap-1 ${cfg.style}`}>
              {cfg.icon}
              {cfg.label}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 -ml-0.5 text-zinc-500 hover:text-zinc-200">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(assessment)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit / View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(assessment.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-zinc-50 line-clamp-2" title={assessment.title}>
            {assessment.title}
          </h3>
        </div>
      </div>

      <div className="relative mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-zinc-400">
            {status === AssessmentStatus.CHECKED ? (
              <span className="font-semibold text-zinc-100 tabular-nums">
                {result?.obtained_marks ?? "-"}/{assessment.max_marks} <span className="text-zinc-500">Marks</span>
              </span>
            ) : (
              <span>Max: {assessment.max_marks} Marks</span>
            )}
          </p>
          {assessment.weightage !== null && assessment.weightage !== undefined && (
            <span className="text-xs font-semibold text-zinc-400">{assessment.weightage}% Weight</span>
          )}
        </div>
      </div>

      {semesterId && status !== AssessmentStatus.CHECKED && (
        <div className="relative mt-4 flex items-center justify-end">
          <WhatIfDialog
            semesterId={semesterId}
            assessmentId={assessment.id}
            currentMarks={result?.obtained_marks || null}
            maxMarks={assessment.max_marks}
            title={assessment.title}
          />
        </div>
      )}

      <div className="relative mt-4 flex min-h-5 items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
        {status === AssessmentStatus.CHECKED ? (
          <span className="text-zinc-500">Assessment complete</span>
        ) : (
          <span>Pending review</span>
        )}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </div>
    </article>
  );
}
