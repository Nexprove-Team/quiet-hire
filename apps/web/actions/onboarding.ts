"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, candidateProfiles } from "@hackhyre/db";
import { getSession } from "@/lib/auth-session";

const COOKIE_NAME = "hyre-onboarding-method";

export type OnboardingMethod = "ai-chat" | "resume" | "manual";

export async function setOnboardingMethod(method: OnboardingMethod) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, method, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  });
}

export async function getOnboardingMethod(): Promise<OnboardingMethod | null> {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (value === "ai-chat" || value === "resume" || value === "manual") {
    return value;
  }
  return null;
}

export async function clearOnboardingCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export interface SaveCandidateProfileInput {
  headline?: string;
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  location?: string;
  isOpenToWork?: boolean;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
}

export async function saveCandidateProfile(input: SaveCandidateProfileInput) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const existing = await db
    .select({ id: candidateProfiles.id })
    .from(candidateProfiles)
    .where(eq(candidateProfiles.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(candidateProfiles)
      .set({
        headline: input.headline ?? null,
        bio: input.bio ?? null,
        skills: input.skills ?? [],
        experienceYears: input.experienceYears ?? null,
        location: input.location ?? null,
        isOpenToWork: input.isOpenToWork ?? true,
        linkedinUrl: input.linkedinUrl ?? null,
        githubUrl: input.githubUrl ?? null,
        portfolioUrl: input.portfolioUrl ?? null,
        resumeUrl: input.resumeUrl ?? null,
        updatedAt: new Date(),
      })
      .where(eq(candidateProfiles.userId, userId));
  } else {
    await db.insert(candidateProfiles).values({
      userId,
      headline: input.headline ?? null,
      bio: input.bio ?? null,
      skills: input.skills ?? [],
      experienceYears: input.experienceYears ?? null,
      location: input.location ?? null,
      isOpenToWork: input.isOpenToWork ?? true,
      linkedinUrl: input.linkedinUrl ?? null,
      githubUrl: input.githubUrl ?? null,
      portfolioUrl: input.portfolioUrl ?? null,
      resumeUrl: input.resumeUrl ?? null,
    });
  }

  const jar = await cookies();
  jar.delete(COOKIE_NAME);

  redirect("/");
}
