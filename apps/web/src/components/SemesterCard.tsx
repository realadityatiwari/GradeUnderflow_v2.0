import { MoreVertical, Calendar, Pencil, Trash, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Semester, SemesterStatus } from "@/lib/services/semester";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SemesterCardProps {
  semester: Semester;
  onEdit: (semester: Semester) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<string, { label: string; style: string }> = {
  [SemesterStatus.CURRENT]: { label: "Current", style: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" },
  [SemesterStatus.COMPLETED]: { label: "Completed", style: "border-sky-300/20 bg-sky-300/10 text-sky-200" },
  [SemesterStatus.ARCHIVED]: { label: "Archived", style: "border-zinc-300/15 bg-zinc-300/[0.08] text-zinc-300" },
};

export function SemesterCard({ semester, onEdit, onDelete }: SemesterCardProps) {
  const cfg = statusConfig[semester.status] ?? statusConfig[SemesterStatus.CURRENT];

  return (
    <article className="group relative min-h-[188px] overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/65 p-5 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-zinc-900/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-400 to-violet-500" />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.025] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${cfg.style}`}>
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
                <DropdownMenuItem onClick={() => onEdit(semester)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(semester.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link href={`/semesters/${semester.id}/subjects`} className="block group/link">
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-zinc-50 transition-colors group-hover/link:text-indigo-200">
              {semester.name}
            </h3>
          </Link>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-lg">
          <GraduationCap className="h-4 w-4" />
        </span>
      </div>

      <div className="relative mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            {semester.academic_year} · {semester.semester_type}
          </p>
          <span className="text-[11px] font-semibold tabular-nums text-zinc-300">{semester.semester_type}</span>
        </div>
      </div>

      <div className="relative mt-5 flex min-h-5 items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
        <span>View subjects</span>
        <Link
          href={`/semesters/${semester.id}/subjects`}
          className="flex items-center gap-1 text-indigo-300 transition-colors hover:text-indigo-200"
        >
          Open
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </article>
  );
}
