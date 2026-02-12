"use client";

import { useState, useTransition } from "react";
import { AnimatePresence } from "motion/react";
import type { OnboardingMethod } from "@/actions/onboarding";
import { setOnboardingMethod } from "@/actions/onboarding";
import { MethodPicker } from "./method-picker";
import { AiChatMode } from "./ai-chat/ai-chat-mode";
import { ResumeUploadMode } from "./resume/resume-upload-mode";
import { OnboardingWizard } from "./onboarding-wizard";

interface CandidateOnboardingProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: "candidate" | "recruiter";
  };
  savedMethod: OnboardingMethod | null;
}

export function CandidateOnboarding({
  user,
  savedMethod,
}: CandidateOnboardingProps) {
  const [method, setMethod] = useState<OnboardingMethod | null>(savedMethod);
  const [, startTransition] = useTransition();

  function handleSelect(selected: OnboardingMethod) {
    setMethod(selected);
    startTransition(() => {
      setOnboardingMethod(selected);
    });
  }

  function handleBack() {
    setMethod(null);
  }

  return (
    <AnimatePresence mode="wait">
      {!method && <MethodPicker key="picker" onSelect={handleSelect} />}
      {method === "ai-chat" && (
        <AiChatMode key="ai-chat" userName={user.name} onBack={handleBack} />
      )}
      {method === "resume" && (
        <ResumeUploadMode key="resume" onBack={handleBack} />
      )}
      {method === "manual" && (
        <OnboardingWizard key="manual" user={user} onBack={handleBack} />
      )}
    </AnimatePresence>
  );
}
