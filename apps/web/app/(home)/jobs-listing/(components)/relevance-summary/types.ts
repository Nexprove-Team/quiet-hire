export interface ResumeData {
  headline: string | null
  bio: string | null
  skills: string[]
  experienceYears: number | null
  location: string | null
}

export interface JobDataForRelevance {
  id: string
  title: string
  description: string
  skills: string[]
  requirements: string[]
  experienceLevel: string
  location: string | null
  isRemote: boolean
  employmentType: string
  company: string | null
}

export interface RelevanceSummary {
  matchPercentage: number
  strengths: string[]
  gaps: string[]
  recommendation: string
}

export interface CachedRelevance {
  summary: RelevanceSummary
  generatedAt: number
}
