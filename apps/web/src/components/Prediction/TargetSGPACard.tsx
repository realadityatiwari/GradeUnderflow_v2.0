"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target } from "lucide-react";
import { TargetSGPAResponse, predictionService } from "@/lib/services/prediction";

export function TargetSGPACard({ semesterId }: { semesterId: string }) {
  const [targetSgpa, setTargetSgpa] = useState("9.0");
  const [result, setResult] = useState<TargetSGPAResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateTarget = async () => {
    const target = parseFloat(targetSgpa);
    if (isNaN(target)) return;
    setLoading(true);
    try {
      const res = await predictionService.calculateTargetSGPA(semesterId, target);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Target SGPA Planner
        </CardTitle>
        <CardDescription>Find out what it takes to hit your goal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            step="0.1" 
            min="0" 
            max="10" 
            value={targetSgpa} 
            onChange={e => setTargetSgpa(e.target.value)} 
            placeholder="e.g. 9.0"
          />
          <Button onClick={calculateTarget} disabled={loading}>
            Calculate
          </Button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${result.is_possible ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="font-medium text-sm mb-1">{result.message}</div>
            {result.is_possible && (
              <div className="text-2xl font-bold tracking-tight">
                {result.required_credit_points} <span className="text-sm font-normal text-muted-foreground">Credit Points Required</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
