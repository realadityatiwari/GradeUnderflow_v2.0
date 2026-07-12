"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Beaker } from "lucide-react";
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

  // Reset when dialog closes
  useEffect(() => {
    if (!open) setResult(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Beaker className="h-3 w-3" /> Simulate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>What-If Simulation</DialogTitle>
          <DialogDescription>
            Simulate how your SGPA will change if you score differently in {title}. This does not save to the database.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="marks" className="text-right">
              Simulated Marks
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="marks"
                type="number"
                value={simulatedMarks}
                onChange={(e) => setSimulatedMarks(e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">/ {maxMarks}</span>
            </div>
          </div>
          
          {result && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center space-y-1">
              <div className="text-sm text-muted-foreground">Simulated Semester SGPA</div>
              <div className="text-4xl font-bold text-primary">{result.semester.sgpa.toFixed(2)}</div>
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
