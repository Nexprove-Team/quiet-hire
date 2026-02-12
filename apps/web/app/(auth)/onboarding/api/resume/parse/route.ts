import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { getSession } from "@/lib/auth-session";

const resumeSchema = z.object({
  headline: z
    .string()
    .optional()
    .describe("Professional headline derived from the resume"),
  bio: z
    .string()
    .optional()
    .describe("Short professional summary from the resume"),
  skills: z
    .array(z.string())
    .optional()
    .describe("List of skills mentioned in the resume"),
  experienceYears: z
    .number()
    .int()
    .optional()
    .describe("Estimated total years of professional experience"),
  location: z.string().optional().describe("Location mentioned in the resume"),
  linkedinUrl: z
    .string()
    .optional()
    .describe("LinkedIn URL if found in the resume"),
  githubUrl: z
    .string()
    .optional()
    .describe("GitHub URL if found in the resume"),
  portfolioUrl: z
    .string()
    .optional()
    .describe("Portfolio or personal website URL if found"),
});

export type ParsedResume = z.infer<typeof resumeSchema>;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return Response.json(
      { error: "Missing resume URL" },
      { status: 400 }
    );
  }

  const response = await fetch(url);
  if (!response.ok) {
    return Response.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const contentType = response.headers.get("content-type") || "application/pdf";

  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: resumeSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: base64,
            mediaType: contentType,
          },
          {
            type: "text",
            text: "Extract the candidate's profile information from this resume. Be accurate and only include information that is clearly stated in the document.",
          },
        ],
      },
    ],
  });

  return Response.json(object);
}
