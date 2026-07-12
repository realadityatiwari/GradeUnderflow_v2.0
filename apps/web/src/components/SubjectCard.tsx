import { MoreVertical, BookOpen, GraduationCap, Pencil, Trash, Target } from "lucide-react";
import { Subject, SubjectType } from "@/lib/services/subject";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

export function SubjectCard({ subject, onEdit, onDelete }: SubjectCardProps) {
  const isTheory = subject.subject_type === SubjectType.THEORY;

  return (
    <article className="group relative min-h-[188px] overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/65 p-5 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-zinc-900/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-400 to-blue-600" />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.025] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-white/[0.08] bg-zinc-950/45 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.11em] text-zinc-400">
              {subject.code}
            </span>
            <Badge variant={isTheory ? "default" : "secondary"} className="text-[9px] uppercase tracking-[0.1em]">
              {subject.subject_type}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 -ml-0.5 text-zinc-500 hover:text-zinc-200">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(subject)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(subject.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link href={`/subjects/${subject.id}/assessments`} className="block group/link">
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-zinc-50 line-clamp-2 transition-colors group-hover/link:text-indigo-200" title={subject.name}>
              {subject.name}
            </h3>
          </Link>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg">
          <Target className="h-4 w-4" />
        </span>
      </div>

      <div className="relative mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
            {subject.credits} Credits
          </p>
          {subject.faculty_name && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 truncate max-w-[50%]" title={subject.faculty_name}>
              <GraduationCap className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span className="truncate">{subject.faculty_name}</span>
            </p>
          )}
        </div>
      </div>

      <div className="relative mt-5 flex min-h-5 items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
        <span>Course details</span>
        <Link
          href={`/subjects/${subject.id}/assessments`}
          className="flex items-center gap-1 text-indigo-300 transition-colors hover:text-indigo-200"
        >
          View assessments
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </article>
  );
}
