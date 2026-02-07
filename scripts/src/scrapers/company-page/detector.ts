export type ATSType = "greenhouse" | "lever" | "generic";

export function detectATS(url: string, html: string): ATSType {
  if (
    url.includes("boards.greenhouse.io") ||
    html.includes("greenhouse") ||
    html.includes("Greenhouse")
  ) {
    return "greenhouse";
  }

  if (
    url.includes("jobs.lever.co") ||
    html.includes("lever-jobs-container") ||
    html.includes("lever.co")
  ) {
    return "lever";
  }

  return "generic";
}
