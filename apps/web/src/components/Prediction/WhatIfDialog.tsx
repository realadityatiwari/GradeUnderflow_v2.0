"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Beaker, FlaskConical } from "lucide-react";
import { WhatIfOverride, predictionService } from "@/lib/services/prediction";
import { SGPACalculationResponse } from "@/lib/services/sgpa";

export function WhatIfDialog({ semesterId, assessmentId, currentMarks, maxMarks, title }: { semesterId: string, assessmentId: string, currentMarks: number | null, maxMarks: number, title: string }) {
  const [simulatedMarks, setSimulatedMarks] = useState(currentMarks?.toString() || "");
  const [result, setResult] = useState<SGPACalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSimulate = async () => {
    const marks = parseFloat(simulatedMarks);
    if (isNaN(marks)) return;
    
    setLoading(true);
    try {
      const overrides: WhatIfOverride[] = [{
        assessment_id: assessmentId,
        simulated_marks: marks
      }];
      const res = await predictionService.simulateWhatIf(semesterId, overrides);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) setResult(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-[10px] h-7">
          <FlaskConical className="h-3 w-3" /> What-If
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>What-If Simulation</DialogTitle>
          <DialogDescription>
            Simulate how your SGPA changes if you score differently in <strong className="text-zinc-100">{title}</strong>. Results are not saved.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="marks" className="text-sm font-medium text-zinc-300 min-w-28">
              Simulated Marks
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="marks"
                type="number"
                value={simulatedMarks}
                onChange={(e) => setSimulatedMarks(e.target.value)}
                className="w-20 text-center"
              />
              <span className="text-sm text-zinc-500">/ {maxMarks}</span>
            </div>
          </div>
          
          {result && (
            <div className="rounded-xl border border-indigo-300/15 bg-indigo-300/[0.06] p-4 text-center space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">Simulated Semester SGPA</p>
              <p className="text-4xl font-semibold tracking-[-0.07em] tabular-nums text-zinc-50">{result.semester.sgpa.toFixed(2)}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSimulate} disabled={loading}>
            {loading ? "Simulating..." : "Run Simulation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
