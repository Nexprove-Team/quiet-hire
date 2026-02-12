import type { ApplicationStatus } from "./mock-data";

export interface MockCandidateUser {
  id: string;
  name: string;
  email: string;
  role: "candidate";
  headline: string;
}

export interface MockCandidateStats {
  totalApplications: number;
  activeApplications: number;
  interviewsUpcoming: number;
  savedJobs: number;
}

export interface MockCandidateApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  location: string;
}

export interface MockCandidateActivity {
  id: string;
  type: "applied" | "status_change" | "interview" | "message" | "profile_view";
  title: string;
  description: string;
  timestamp: string;
}

export const MOCK_CANDIDATE_USER: MockCandidateUser = {
  id: "cand-001",
  name: "Alex Johnson",
  email: "alex@example.com",
  role: "candidate",
  headline: "Senior Frontend Engineer",
};

export const MOCK_CANDIDATE_STATS: MockCandidateStats = {
  totalApplications: 12,
  activeApplications: 5,
  interviewsUpcoming: 2,
  savedJobs: 8,
};

export const MOCK_CANDIDATE_APPLICATIONS: MockCandidateApplication[] = [
  {
    id: "capp-001",
    jobTitle: "Senior Frontend Engineer",
    companyName: "Acme Technologies",
    status: "under_review",
    appliedAt: "2026-02-10",
    location: "San Francisco, CA",
  },
  {
    id: "capp-002",
    jobTitle: "Full Stack Developer",
    companyName: "N26",
    status: "interviewing",
    appliedAt: "2026-02-08",
    location: "Berlin, DE",
  },
  {
    id: "capp-003",
    jobTitle: "Frontend Lead",
    companyName: "Stripe",
    status: "not_reviewed",
    appliedAt: "2026-02-07",
    location: "Remote",
  },
  {
    id: "capp-004",
    jobTitle: "React Developer",
    companyName: "Vercel",
    status: "hired",
    appliedAt: "2026-02-03",
    location: "Remote",
  },
  {
    id: "capp-005",
    jobTitle: "Software Engineer",
    companyName: "Meta",
    status: "interviewing",
    appliedAt: "2026-02-05",
    location: "Menlo Park, CA",
  },
  {
    id: "capp-006",
    jobTitle: "UI Engineer",
    companyName: "Figma",
    status: "rejected",
    appliedAt: "2026-01-28",
    location: "San Francisco, CA",
  },
  {
    id: "capp-007",
    jobTitle: "Platform Engineer",
    companyName: "Datadog",
    status: "under_review",
    appliedAt: "2026-02-09",
    location: "New York, NY",
  },
];

export const MOCK_CANDIDATE_ACTIVITY: MockCandidateActivity[] = [
  {
    id: "act-001",
    type: "applied",
    title: "Applied to Platform Engineer",
    description: "Datadog - New York, NY",
    timestamp: "2026-02-09T14:30:00",
  },
  {
    id: "act-002",
    type: "status_change",
    title: "Application moved to Review",
    description: "Senior Frontend Engineer at Acme Technologies",
    timestamp: "2026-02-09T10:15:00",
  },
  {
    id: "act-003",
    type: "interview",
    title: "Interview scheduled",
    description: "Full Stack Developer at N26 - Feb 14, 2:00 PM",
    timestamp: "2026-02-08T16:00:00",
  },
  {
    id: "act-004",
    type: "message",
    title: "New message from recruiter",
    description: "Acme Technologies - Re: Frontend Engineer role",
    timestamp: "2026-02-08T11:30:00",
  },
  {
    id: "act-005",
    type: "profile_view",
    title: "Profile viewed by recruiter",
    description: "Stripe - Engineering team",
    timestamp: "2026-02-08T09:00:00",
  },
  {
    id: "act-006",
    type: "applied",
    title: "Applied to Frontend Lead",
    description: "Stripe - Remote",
    timestamp: "2026-02-07T15:45:00",
  },
  {
    id: "act-007",
    type: "status_change",
    title: "Interview stage reached",
    description: "Software Engineer at Meta",
    timestamp: "2026-02-06T14:20:00",
  },
  {
    id: "act-008",
    type: "message",
    title: "New message from recruiter",
    description: "N26 - Re: Full Stack Developer position",
    timestamp: "2026-02-06T10:00:00",
  },
  {
    id: "act-009",
    type: "profile_view",
    title: "Profile viewed by recruiter",
    description: "Vercel - Frontend team",
    timestamp: "2026-02-05T17:30:00",
  },
  {
    id: "act-010",
    type: "status_change",
    title: "Offer received",
    description: "React Developer at Vercel",
    timestamp: "2026-02-04T11:00:00",
  },
];

export const MOCK_CANDIDATE_CHART_DATA = [
  { date: "Mon", applications: 2 },
  { date: "Tue", applications: 1 },
  { date: "Wed", applications: 3 },
  { date: "Thu", applications: 0 },
  { date: "Fri", applications: 2 },
  { date: "Sat", applications: 1 },
  { date: "Sun", applications: 0 },
];

export const MOCK_CANDIDATE_NOTIFICATIONS = [
  {
    id: 1,
    title: "Application reviewed",
    desc: "Acme Technologies viewed your application for Senior Frontend Engineer",
    time: "2h ago",
    read: false,
  },
  {
    id: 2,
    title: "Interview invitation",
    desc: "N26 scheduled an interview for Full Stack Developer - Feb 14",
    time: "5h ago",
    read: false,
  },
  {
    id: 3,
    title: "Profile viewed",
    desc: "A recruiter at Stripe viewed your profile",
    time: "1d ago",
    read: true,
  },
];
