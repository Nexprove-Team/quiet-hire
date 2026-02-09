"use client";

import { useState } from "react";
import { ArrowRight } from "@hackhyre/ui/icons";

import { Button } from "@hackhyre/ui/components/button";
import { Input } from "@hackhyre/ui/components/input";
import { Label } from "@hackhyre/ui/components/label";
import { Checkbox } from "@hackhyre/ui/components/checkbox";
import { RadioGroup, RadioGroupItem } from "@hackhyre/ui/components/radio-group";
import { Switch } from "@hackhyre/ui/components/switch";
import { cn } from "@hackhyre/ui/lib/utils";
import type { StepProps } from "../onboarding-wizard";

const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

export function TalentStepPreferences({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepProps) {
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(
    data.preferredEmploymentTypes ?? ["full_time"]
  );
  const [experienceLevel, setExperienceLevel] = useState(
    data.preferredExperienceLevel ?? "mid"
  );
  const [isRemote, setIsRemote] = useState(data.isRemotePreferred ?? true);
  const [isOpenToWork, setIsOpenToWork] = useState(
    data.isOpenToWork ?? true
  );
  const [salaryMin, setSalaryMin] = useState(
    data.salaryMin?.toString() ?? ""
  );
  const [salaryMax, setSalaryMax] = useState(
    data.salaryMax?.toString() ?? ""
  );

  function toggleEmploymentType(value: string) {
    setEmploymentTypes((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : [...prev, value]
    );
  }

  function handleContinue() {
    onUpdate({
      preferredEmploymentTypes: employmentTypes,
      preferredExperienceLevel: experienceLevel,
      isRemotePreferred: isRemote,
      isOpenToWork,
      salaryMin: salaryMin ? parseInt(salaryMin, 10) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax, 10) : undefined,
    });
    onNext();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-mono text-2xl font-bold tracking-tight">
          What are you looking for?
        </h2>
        <p className="text-muted-foreground text-sm">
          Help us match you with the right opportunities
        </p>
      </div>

      <div className="space-y-3">
        <Label>Employment Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {EMPLOYMENT_TYPES.map(({ value, label }) => (
            <label
              key={value}
              className={cn(
                "border-input flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                employmentTypes.includes(value) &&
                  "border-primary bg-primary/5"
              )}
            >
              <Checkbox
                checked={employmentTypes.includes(value)}
                onCheckedChange={() => toggleEmploymentType(value)}
              />
              <span className="text-sm font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Experience Level</Label>
        <RadioGroup
          value={experienceLevel}
          onValueChange={setExperienceLevel}
          className="grid grid-cols-3 gap-2 sm:grid-cols-5"
        >
          {EXPERIENCE_LEVELS.map(({ value, label }) => (
            <label
              key={value}
              className={cn(
                "border-input flex cursor-pointer flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-colors",
                experienceLevel === value &&
                  "border-primary bg-primary/5"
              )}
            >
              <RadioGroupItem
                value={value}
                className="sr-only"
              />
              <span className="text-xs font-medium">{label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Open to remote work</Label>
            <p className="text-muted-foreground text-xs">
              Show remote opportunities in your feed
            </p>
          </div>
          <Switch checked={isRemote} onCheckedChange={setIsRemote} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Open to work</Label>
            <p className="text-muted-foreground text-xs">
              Let recruiters know you&apos;re available
            </p>
          </div>
          <Switch
            checked={isOpenToWork}
            onCheckedChange={setIsOpenToWork}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Salary Expectations (USD)</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">Min</span>
            <Input
              type="number"
              placeholder="50,000"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">Max</span>
            <Input
              type="number"
              placeholder="120,000"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue}>
          Finish
          <ArrowRight size={16} variant="Linear" className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
