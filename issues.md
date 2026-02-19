
● Explore(Find broken links recruiter side)
  ⎿  Backgrounded agent (↓ to manage · ctrl+o to expand)

● Task Output a806d14
  ⎿  Read output (ctrl+o to expand)

● Here's the full audit:

  ---
  Broken Links

  File: components/dashboard/quick-actions.tsx
  Line: 11
  Current href: href="/candidates"
  Issue: Missing /recuriter/ prefix — should be /recuriter/candidates
  ────────────────────────────────────────
  File: components/dashboard/quick-actions.tsx
  Line: 17
  Current href: href="/jobs/create"
  Issue: Missing /recuriter/ prefix — should be /recuriter/jobs/create

  All other links (sidebar, jobs table, candidate cards, dashboard tables, breadcrumbs) are correctly
  pointing to existing pages.

  ---
  Sheets/Modals Using Mock/Dummy Data

  Candidate Sheet (components/dashboard/candidate-sheet.tsx) — Almost entirely mock

  - CV Tab — Uses MOCK_CANDIDATES from lib/mock-data.ts for summary, work history, education, skills,
  languages
  - Applied Jobs Tab — Uses MOCK_APPLICATIONS for job history and statuses
  - Messages Tab — Uses MOCK_MESSAGES with hardcoded sender roles; has a fixed date 2026-02-09
  - Activity Tab — 100% hardcoded activity array, no real data at all
  - Action buttons stubbed (no onClick): Send Email, Schedule Interview, Add to Talent Pool
  - The "Message" button works (just switches tabs)

  Interview Detail Sheet (components/dashboard/interview-detail-sheet.tsx) — Mostly real

  - Displays real interview data from useRecruiterInterviews()
  - Meeting link copy + Join button work
  - Reschedule button — stubbed, shows toast('Reschedule coming soon')

  Schedule Interview Sheet (components/dashboard/schedule-interview-sheet.tsx) — Fully functional

  - Real form validation with Zod
  - Real API via useScheduleInterview() hook
  - Google Calendar OAuth integration
  - No mock data

  ---
  Stubbed Action Buttons (no onClick handlers)

  Location: Job detail page (jobs/[id]/page.tsx)
  Actions: Duplicate, Edit, Delete buttons
  Lines: 193-216
  ────────────────────────────────────────
  Location: Jobs list dropdown (jobs/page.tsx)
  Actions: Edit, Duplicate, Delete menu items
  Lines: 184-194
  ────────────────────────────────────────
  Location: Candidate detail quick actions
  Actions: Send Email, Schedule Interview, Add to Talent Pool
  Lines: (stubbed)
  ────────────────────────────────────────
  Location: Interview detail sheet
  Actions: Reschedule button
  Lines: 362

  ---
  Want me to start fixing the broken links and then work through the stubbed features?

✻ Sautéed for 2m 36s

● Agent "Find broken links recruiter side" completed

● Let me fix the two broken links right now — that's a quick win.

● Read 1 file (ctrl+o to expand)

● Update(apps/web/components/dashboard/quick-actions.tsx)
  ⎿  Added 1 line, removed 1 line
       8    return (
       9      <div className="flex items-center gap-2">
      10        <Button variant="outline" size="sm" asChild>
      11 -        <Link href="/candidates">
      11 +        <Link href="/recuriter/candidates">
      12            <People size={16} variant="Linear" className="mr-1.5" />
      13            Candidates
      14          </Link>

● Update(apps/web/components/dashboard/quick-actions.tsx)
  ⎿  Added 1 line, removed 1 line
      14          </Link>
      15        </Button>
      16        <Button size="sm" asChild>
      17 -        <Link href="/jobs/create">
      17 +        <Link href="/recuriter/jobs/create">
      18            <AddCircle size={16} variant="Bold" className="mr-1.5" />
      19            Create Job
      20          </Link>

● Both broken links fixed. Here's the updated full picture:

  Fixed now:
  - /candidates → /recuriter/candidates
  - /jobs/create → /recuriter/jobs/create

  Still outstanding (from both audits combined):

  #: 1
  Issue: Candidate Sheet — all 4 tabs use mock data (MOCK_CANDIDATES, MOCK_APPLICATIONS, MOCK_MESSAGES,
    hardcoded activities)
  Type: Mock data
  ────────────────────────────────────────
  #: 2
  Issue: Candidate Sheet — Send Email, Schedule Interview, Add to Talent Pool buttons have no onClick
  Type: Stubbed
  ────────────────────────────────────────
  #: 3
  Issue: Job detail page — Edit, Duplicate, Delete buttons have no onClick
  Type: Stubbed
  ────────────────────────────────────────
  #: 4
  Issue: Jobs list dropdown — Edit, Duplicate, Delete menu items have no onClick
  Type: Stubbed
  ────────────────────────────────────────
  #: 5
  Issue: Interview detail sheet — Reschedule button shows "coming soon" toast
  Type: Stubbed
  ────────────────────────────────────────
  #: 6
  Issue: Application status updates — no way to change status in the pipeline
  Type: Missing

  What would you like to tackle next?