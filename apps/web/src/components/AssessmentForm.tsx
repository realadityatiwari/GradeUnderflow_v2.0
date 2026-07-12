"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AssessmentType,
  AssessmentCategory,
  AssessmentStatus,
  Assessment,
  AssessmentCreate,
  AssessmentUpdate,
  AssessmentResultUpdate,
} from "@/lib/services/assessment";

// Zod Schema for Assessment Definition
const definitionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100, "Title max 100 characters."),
  assessment_type: z.nativeEnum(AssessmentType),
  assessment_category: z.nativeEnum(AssessmentCategory),
  max_marks: z.number().int("Must be an integer").positive("Must be greater than 0"),
  weightage: z.number().int().min(0).max(100).optional(),
});

type DefinitionFormValues = z.infer<typeof definitionSchema>;

// Zod Schema for Assessment Result
const resultSchema = z.object({
  status: z.nativeEnum(AssessmentStatus),
  obtained_marks: z.number().int("Must be an integer").min(0, "Cannot be negative").optional(),
  remarks: z.string().max(255).optional(),
});

type ResultFormValues = z.infer<typeof resultSchema>;

interface AssessmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitDefinition: (data: AssessmentCreate | AssessmentUpdate) => Promise<void>;
  onSubmitResult: (data: AssessmentResultUpdate) => Promise<void>;
  initialData?: Assessment | null;
}

export function AssessmentForm({
  open,
  onOpenChange,
  onSubmitDefinition,
  onSubmitResult,
  initialData,
}: AssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("definition");

  const defForm = useForm<DefinitionFormValues>({
    resolver: zodResolver(definitionSchema),
    defaultValues: {
      title: "",
      assessment_type: AssessmentType.ASSIGNMENT,
      assessment_category: AssessmentCategory.THEORY,
      max_marks: 100,
      weightage: undefined,
    },
  });

  const resForm = useForm<ResultFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      status: AssessmentStatus.NOT_STARTED,
      obtained_marks: undefined,
      remarks: undefined,
    },
  });

  useEffect(() => {
    if (initialData && open) {
      defForm.reset({
        title: initialData.title,
        assessment_type: initialData.assessment_type,
        assessment_category: initialData.assessment_category,
        max_marks: initialData.max_marks,
        weightage: initialData.weightage ?? undefined,
      });
      if (initialData.result) {
        resForm.reset({
          status: initialData.result.status,
          obtained_marks: initialData.result.obtained_marks ?? undefined,
          remarks: initialData.result.remarks ?? undefined,
        });
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab("definition");
       
      setApiError(null);
    } else if (!open) {
      defForm.reset({
        title: "",
        assessment_type: AssessmentType.ASSIGNMENT,
        assessment_category: AssessmentCategory.THEORY,
        max_marks: 100,
        weightage: undefined,
      });
      resForm.reset({
        status: AssessmentStatus.NOT_STARTED,
        obtained_marks: undefined,
        remarks: undefined,
      });
       
      setActiveTab("definition");
       
      setApiError(null);
    }
  }, [initialData, open, defForm, resForm]);

  const handleDefSubmit = async (values: DefinitionFormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await onSubmitDefinition(values);
      if (!initialData) {
        onOpenChange(false); // Close if creating new
      }
    } catch (error: any) {
      console.error(error);
      const detail = error?.response?.data?.detail;
      setApiError(typeof detail === "string" ? detail : "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResSubmit = async (values: ResultFormValues) => {
    if (!initialData) return;
    setIsSubmitting(true);
    setApiError(null);
    try {
      // Manual cross-field validation
      if (values.obtained_marks !== undefined && values.obtained_marks !== null) {
        if (values.obtained_marks > initialData.max_marks) {
          setApiError(`Obtained marks cannot exceed ${initialData.max_marks}.`);
          setIsSubmitting(false);
          return;
        }
      }
      await onSubmitResult(values);
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      const detail = error?.response?.data?.detail;
      setApiError(typeof detail === "string" ? detail : "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Assessment" : "Add Assessment"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update assessment details and results."
              : "Add a new assessment to this subject."}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {apiError}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="definition">Definition</TabsTrigger>
            <TabsTrigger value="result" disabled={!initialData}>
              Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="definition">
            <Form {...defForm}>
              <form onSubmit={defForm.handleSubmit(handleDefSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={defForm.control}
                    name="assessment_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialData}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={AssessmentType.ASSIGNMENT}>Assignment</SelectItem>
                            <SelectItem value={AssessmentType.QUIZ}>Quiz</SelectItem>
                            <SelectItem value={AssessmentType.SURPRISE_TEST}>Surprise Test</SelectItem>
                            <SelectItem value={AssessmentType.PRE_END}>Pre-End Exam</SelectItem>
                            <SelectItem value={AssessmentType.END_SEMESTER}>End Semester</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={defForm.control}
                    name="assessment_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(AssessmentCategory).map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={defForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Assignment 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={defForm.control}
                    name="max_marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Marks</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={defForm.control}
                    name="weightage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weightage % (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            max="100" 
                            {...field} 
                            value={field.value === undefined ? "" : field.value}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : initialData ? "Save Definition" : "Create Assessment"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="result">
            {initialData && (
              <Form {...resForm}>
                <form onSubmit={resForm.handleSubmit(handleResSubmit)} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={resForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={AssessmentStatus.NOT_STARTED}>Not Started</SelectItem>
                              <SelectItem value={AssessmentStatus.IN_PROGRESS}>In Progress</SelectItem>
                              <SelectItem value={AssessmentStatus.SUBMITTED}>Submitted</SelectItem>
                              <SelectItem value={AssessmentStatus.CHECKED}>Checked</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resForm.control}
                      name="obtained_marks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Obtained Marks</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              max={initialData.max_marks}
                              {...field} 
                              value={field.value === undefined ? "" : field.value}
                              onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={resForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Feedback or notes" 
                            {...field} 
                            value={field.value === undefined ? "" : field.value}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Result"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
