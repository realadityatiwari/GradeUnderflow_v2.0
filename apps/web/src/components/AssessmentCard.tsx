import { Pencil, Trash, FileText, CheckCircle2, Clock, CircleDashed } from "lucide-react";
import { Assessment, AssessmentStatus } from "@/lib/services/assessment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function AssessmentCard({ assessment, semesterId, onEdit, onDelete }: AssessmentCardProps) {
  const result = assessment.result;
  const status = result?.status || AssessmentStatus.NOT_STARTED;
  
  const getStatusIcon = () => {
    switch (status) {
      case AssessmentStatus.CHECKED:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case AssessmentStatus.SUBMITTED:
        return <FileText className="h-4 w-4 text-blue-500" />;
      case AssessmentStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CircleDashed className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case AssessmentStatus.CHECKED:
        return "Graded";
      case AssessmentStatus.SUBMITTED:
        return "Submitted";
      case AssessmentStatus.IN_PROGRESS:
        return "In Progress";
      default:
        return "Not Started";
    }
  };

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {assessment.assessment_category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              {getStatusIcon()}
              <span>{getStatusLabel()}</span>
            </div>
          </div>
          <CardTitle className="text-lg font-bold pt-1 line-clamp-2" title={assessment.title}>
            {assessment.title}
          </CardTitle>
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
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {status === AssessmentStatus.CHECKED ? (
              <span className="font-semibold text-foreground">
                {result?.obtained_marks ?? "-"}/{assessment.max_marks} Marks
              </span>
            ) : (
              <span>Max: {assessment.max_marks} Marks</span>
            )}
          </div>
          {assessment.weightage !== null && assessment.weightage !== undefined && (
            <div className="text-muted-foreground">
              {assessment.weightage}% Weight
            </div>
          )}
        </div>
        
        {semesterId && status !== AssessmentStatus.CHECKED && (
          <div className="mt-4 flex justify-end">
             <WhatIfDialog 
                semesterId={semesterId} 
                assessmentId={assessment.id} 
                currentMarks={result?.obtained_marks || null} 
                maxMarks={assessment.max_marks} 
                title={assessment.title}
             />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
