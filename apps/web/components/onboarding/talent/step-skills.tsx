"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code, LinkIcon, Add, CloseCircle } from "@hackhyre/ui/icons";

import { Button } from "@hackhyre/ui/components/button";
import { Input } from "@hackhyre/ui/components/input";
import { Badge } from "@hackhyre/ui/components/badge";
import { Slider } from "@hackhyre/ui/components/slider";
import { Label } from "@hackhyre/ui/components/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hackhyre/ui/components/form";
import type { StepProps } from "../onboarding-wizard";

const schema = z.object({
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function TalentStepSkills({ data, onUpdate, onNext, onBack }: StepProps) {
  const [skills, setSkills] = useState<string[]>(data.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [experienceYears, setExperienceYears] = useState(
    data.experienceYears ?? 2
  );

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      linkedinUrl: data.linkedinUrl ?? "",
      githubUrl: data.githubUrl ?? "",
    },
  });

  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  }

  function onSubmit(values: Values) {
    onUpdate({
      ...values,
      skills,
      experienceYears,
    });
    onNext();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-mono text-2xl font-bold tracking-tight">
          Skills & Experience
        </h2>
        <p className="text-muted-foreground text-sm">
          Highlight what makes you stand out
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addSkill}
              >
                <Add size={18} variant="Linear" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-destructive ml-1 transition-colors"
                    >
                      <CloseCircle size={14} variant="Linear" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Years of Experience</Label>
              <span className="text-primary text-sm font-semibold">
                {experienceYears === 20 ? "20+" : experienceYears}{" "}
                {experienceYears === 1 ? "year" : "years"}
              </span>
            </div>
            <Slider
              value={[experienceYears]}
              onValueChange={([val]) => val !== undefined && setExperienceYears(val)}
              min={0}
              max={20}
              step={1}
            />
          </div>

          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <LinkIcon size={14} variant="Bulk" />
                  LinkedIn
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/in/yourprofile"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Code size={14} variant="Bulk" />
                  GitHub
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/yourusername"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-2">
            <Button type="button" variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
