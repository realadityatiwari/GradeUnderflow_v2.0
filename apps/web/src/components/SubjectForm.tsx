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

import { SubjectType, SubjectCreate, SubjectUpdate, Subject } from "@/lib/services/subject";

const formSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters.").max(20, "Code max 20 characters."),
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name max 100 characters."),
  subject_type: z.nativeEnum(SubjectType),
  credits: z.number().int("Credits must be an integer").positive("Credits must be greater than 0"),
  faculty_name: z.string().max(100).optional().or(z.literal("")),
  color: z.string().max(7).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface SubjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubjectCreate | SubjectUpdate) => Promise<void>;
  initialData?: Subject | null;
}

export function SubjectForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: SubjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      subject_type: SubjectType.THEORY,
      credits: 3,
      faculty_name: "",
      color: "",
    },
  });

  useEffect(() => {
    if (initialData && open) {
      form.reset({
        code: initialData.code,
        name: initialData.name,
        subject_type: initialData.subject_type,
        credits: initialData.credits,
        faculty_name: initialData.faculty_name || "",
        color: initialData.color || "",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiError(null);
    } else if (!open) {
      form.reset({
        code: "",
        name: "",
        subject_type: SubjectType.THEORY,
        credits: 3,
        faculty_name: "",
        color: "",
      });
       
      setApiError(null);
    }
  }, [initialData, open, form]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const payload: SubjectCreate = {
        ...values,
        faculty_name: values.faculty_name || null,
        color: values.color || null,
      };
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      const detail = error?.response?.data?.detail;
      setApiError(typeof detail === "string" ? detail : "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Subject" : "Add Subject"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update subject details."
              : "Add a new subject to this semester."}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {apiError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CS401" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Advanced Algorithms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(SubjectType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="faculty_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dr. Alan Turing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : initialData
                  ? "Update Subject"
                  : "Add Subject"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
