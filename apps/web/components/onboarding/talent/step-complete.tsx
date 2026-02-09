"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { TickCircle, ArrowRight } from "@hackhyre/ui/icons";

import { Button } from "@hackhyre/ui/components/button";
import type { StepProps } from "../onboarding-wizard";

export function TalentStepComplete({ user }: StepProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center space-y-6 py-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
      >
        <TickCircle size={80} variant="Bulk" className="text-primary" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="font-mono text-3xl font-bold tracking-tight">
          You&apos;re all set!
        </h2>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          Your profile is ready, {user.name.split(" ")[0]}. Start exploring
          jobs and connect directly with hiring teams.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 pt-4"
      >
        <Button size="lg" onClick={() => router.push("/")}>
          Explore Jobs
          <ArrowRight size={18} variant="Linear" className="ml-1" />
        </Button>
      </motion.div>
    </div>
  );
}
