import { MoreVertical, BookOpen, GraduationCap, Pencil, Trash } from "lucide-react";
import { Subject, SubjectType } from "@/lib/services/subject";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="flex flex-col transition-shadow hover:shadow-md h-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              {subject.code}
            </span>
            <Badge variant={isTheory ? "default" : "secondary"}>
              {subject.subject_type}
            </Badge>
          </div>
          <Link href={`/subjects/${subject.id}/assessments`} className="hover:underline">
            <CardTitle className="text-xl font-bold pt-1 line-clamp-2" title={subject.name}>
              {subject.name}
            </CardTitle>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
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
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end pt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <BookOpen className="mr-1.5 h-4 w-4" />
            {subject.credits} Credits
          </div>
          {subject.faculty_name && (
            <div className="flex items-center max-w-[50%]">
              <GraduationCap className="mr-1.5 h-4 w-4 shrink-0" />
              <span className="truncate" title={subject.faculty_name}>
                {subject.faculty_name}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
