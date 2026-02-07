/**
 * Seed list of target companies to scrape.
 * Add companies here, then run:
 *   tsx src/index.ts --platform company-page --query <careers-url>
 *   tsx src/index.ts --platform linkedin --query <company-name>
 */
export const targetCompanies = [
  {
    name: "Stripe",
    careersUrl: "https://stripe.com/jobs/search",
    greenhouse: "https://boards.greenhouse.io/stripe",
  },
  {
    name: "Vercel",
    careersUrl: "https://vercel.com/careers",
    greenhouse: "https://boards.greenhouse.io/vercel",
  },
  {
    name: "Linear",
    careersUrl: "https://linear.app/careers",
    lever: "https://jobs.lever.co/linear",
  },
  {
    name: "Figma",
    careersUrl: "https://www.figma.com/careers",
    greenhouse: "https://boards.greenhouse.io/figma",
  },
  {
    name: "Notion",
    careersUrl: "https://www.notion.so/careers",
    greenhouse: "https://boards.greenhouse.io/notion",
  },
];
