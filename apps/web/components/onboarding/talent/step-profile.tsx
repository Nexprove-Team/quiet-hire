"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Location, User, DocumentText } from "@hackhyre/ui/icons";

import { Button } from "@hackhyre/ui/components/button";
import { Input } from "@hackhyre/ui/components/input";
import { Textarea } from "@hackhyre/ui/components/textarea";
import {
  Avatar,
  AvatarFallback,
} from "@hackhyre/ui/components/avatar";
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
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function TalentStepProfile({ user, data, onUpdate, onNext }: StepProps) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: data.headline ?? "",
      bio: data.bio ?? "",
      location: data.location ?? "",
    },
  });

  function onSubmit(values: Values) {
    onUpdate(values);
    onNext();
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-mono text-2xl font-bold tracking-tight">
          Let&apos;s set up your profile
        </h2>
        <p className="text-muted-foreground text-sm">
          Tell companies who you are, {user.name.split(" ")[0]}
        </p>
      </div>

      <div className="flex justify-center">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User size={14} variant="Bulk" />
                  Professional Headline
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full-Stack Developer | React & Node.js"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DocumentText size={14} variant="Bulk" />
                  About You
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A brief summary of your experience and what you're passionate about..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Location size={14} variant="Bulk" />
                  Location
                </FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
