"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const role =
    searchParams.get("role") === "recruiter" ? "recruiter" : "candidate";

  return (
    <OnboardingWizard
      user={{
        id: "demo-user",
        name: "Jane Doe",
        email: "jane@example.com",
        role,
      }}
    />
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingContent />
    </Suspense>
  );
}
