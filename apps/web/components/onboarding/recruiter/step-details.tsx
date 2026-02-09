"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinkIcon } from "@hackhyre/ui/icons";

import { Button } from "@hackhyre/ui/components/button";
import { Input } from "@hackhyre/ui/components/input";
import { Textarea } from "@hackhyre/ui/components/textarea";
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
  companyMission: z.string().optional(),
  companyLinkedinUrl: z.string().optional(),
  companyTwitterUrl: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function RecruiterStepDetails({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepProps) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyMission: data.companyMission ?? "",
      companyLinkedinUrl: data.companyLinkedinUrl ?? "",
      companyTwitterUrl: data.companyTwitterUrl ?? "",
    },
  });

  function onSubmit(values: Values) {
    onUpdate(values);
    onNext();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-mono text-2xl font-bold tracking-tight">
          Company Details
        </h2>
        <p className="text-muted-foreground text-sm">
          Share more about your culture and connect your socials
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyMission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mission & Culture</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What drives your team? What's it like to work at your company?"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyLinkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <LinkIcon size={14} variant="Bulk" />
                  LinkedIn Page
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/company/acme"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyTwitterUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <LinkIcon size={14} variant="Bulk" />
                  Twitter / X
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://twitter.com/acme"
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
