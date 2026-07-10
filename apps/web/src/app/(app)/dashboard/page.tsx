"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}!</h1>
        <p className="text-muted-foreground mt-2">
          Here is an overview of your academic progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Semesters</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Manage your academic terms, subjects, and view your SGPA.
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/semesters">View Semesters</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for future Analytics / SGPA summary */}
        <Card className="opacity-50 grayscale cursor-not-allowed">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Current SGPA</CardTitle>
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">--</div>
            <CardDescription>
              Analytics module coming soon.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
