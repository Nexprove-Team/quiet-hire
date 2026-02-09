"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "@hackhyre/ui/icons";

import { Button } from "@hackhyre/ui/components/button";
import { Input } from "@hackhyre/ui/components/input";
import { Textarea } from "@hackhyre/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hackhyre/ui/components/select";
import { Switch } from "@hackhyre/ui/components/switch";
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
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Description is required"),
  jobEmploymentType: z.string().optional(),
  jobExperienceLevel: z.string().optional(),
  jobLocation: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function RecruiterStepFirstJob({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepProps) {
  const [isRemote, setIsRemote] = useState(data.jobIsRemote ?? false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobTitle: data.jobTitle ?? "",
      jobDescription: data.jobDescription ?? "",
      jobEmploymentType: data.jobEmploymentType ?? "full_time",
      jobExperienceLevel: data.jobExperienceLevel ?? "mid",
      jobLocation: data.jobLocation ?? "",
    },
  });

  function onSubmit(values: Values) {
    onUpdate({ ...values, jobIsRemote: isRemote });
    onNext();
  }

  function handleSkip() {
    onNext();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="font-mono text-2xl font-bold tracking-tight">
            Post your first job
          </h2>
          <p className="text-muted-foreground text-sm">
            Get started by creating a draft job listing
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground shrink-0"
          onClick={handleSkip}
        >
          Skip for now
          <ArrowRight size={14} variant="Linear" className="ml-1" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Senior Frontend Engineer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="jobEmploymentType"
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
                      <SelectItem value="full_time">Full-time</SelectItem>
                      <SelectItem value="part_time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobExperienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entry">Entry</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="jobLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Label>Remote</Label>
            <Switch checked={isRemote} onCheckedChange={setIsRemote} />
          </div>

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={4}
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
            <Button type="submit">Create Draft & Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
