import { MoreVertical, Calendar, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { Semester, SemesterStatus } from "@/lib/services/semester";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export function SemesterCard({ semester, onEdit, onDelete }: SemesterCardProps) {
  const isCurrent = semester.status === SemesterStatus.CURRENT;
  const isArchived = semester.status === SemesterStatus.ARCHIVED;

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md h-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <Link href={`/semesters/${semester.id}/subjects`} className="hover:underline">
            <CardTitle className="text-xl font-bold">{semester.name}</CardTitle>
          </Link>
          <div className="flex items-center text-sm text-muted-foreground pt-1">
            <Calendar className="mr-2 h-4 w-4" />
            {semester.academic_year} • {semester.semester_type}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={isCurrent ? "default" : isArchived ? "secondary" : "outline"}
            className={isCurrent ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {semester.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
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
      </CardHeader>
      <CardContent className="flex-1">
        {/* Placeholder for future module links/stats */}
        <p className="text-sm text-muted-foreground mt-4">
          Data and stats for this semester will appear here.
        </p>
      </CardContent>
    </Card>
  );
}
