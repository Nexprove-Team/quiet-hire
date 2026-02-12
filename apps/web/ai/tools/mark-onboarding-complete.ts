import { tool } from "ai";
import { z } from "zod";

export function createMarkOnboardingCompleteTool() {
  return tool({
    description:
      "Signal that onboarding is complete. Call this AFTER you have successfully saved the profile. The client will detect this tool call and redirect the user to the dashboard.",
    inputSchema: z.object({}),
    execute: async () => {
      return { complete: true };
    },
  });
}
