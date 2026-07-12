"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SGPACalculationResponse, sgpaService } from "@/lib/services/sgpa";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function SGPASection({ semesterId }: { semesterId: string }) {
  const [data, setData] = useState<SGPACalculationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSGPA = async () => {
      try {
        const response = await sgpaService.getSGPA(semesterId);
        setData(response);
      } catch (error) {
        console.error("Failed to load SGPA", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSGPA();
  }, [semesterId]);

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const { semester, subjects } = data;

  return (
    <div className="space-y-6 mb-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Semester SGPA</CardTitle>
            <CardDescription>Academic Performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-primary mb-2">
              {semester.sgpa.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Based on {subjects.length} subjects
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Credits</CardTitle>
            <CardDescription>Registered Credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {semester.total_credits}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Credit Points</CardTitle>
            <CardDescription>Earned Points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {semester.earned_credit_points}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Breakdown</CardTitle>
          <CardDescription>Detailed view of credits and grades per subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Grade Point</TableHead>
                  <TableHead className="text-right">Credit Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.code}</TableCell>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell className="text-center">{subject.credits}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={subject.grade === "F" ? "destructive" : "secondary"}>
                        {subject.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{subject.grade_point}</TableCell>
                    <TableCell className="text-right font-medium">
                      {subject.credit_points}
                    </TableCell>
                  </TableRow>
                ))}
                {subjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No subjects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
