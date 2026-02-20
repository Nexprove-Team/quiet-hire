import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from '@/lib/auth-client'
import { useProfile } from '@/hooks/use-profile'
import { useRelevanceStore } from './use-relevance-store'
import type {
  ResumeData,
  JobDataForRelevance,
  RelevanceSummary,
} from './types'

type Status = 'idle' | 'parsing' | 'generating' | 'ready' | 'error'

interface UseRelevanceReturn {
  status: Status
  summary: RelevanceSummary | null
  error: string | null
  hasResumeData: boolean
  handleFileUpload: (file: File) => void
  handleChangeResume: () => void
  isCandidate: boolean
}

export function useRelevance(jobData: JobDataForRelevance): UseRelevanceReturn {
  const { data: session } = useSession()
  const isCandidate = session?.user?.role === 'candidate'

  const { data: profile } = useProfile()

  const resumeData = useRelevanceStore((s) => s.resumeData)
  const setResumeData = useRelevanceStore((s) => s.setResumeData)
  const clearResumeData = useRelevanceStore((s) => s.clearResumeData)
  const getSummary = useRelevanceStore((s) => s.getSummary)
  const setSummary = useRelevanceStore((s) => s.setSummary)

  const [status, setStatus] = useState<Status>('idle')
  const [summary, setSummaryState] = useState<RelevanceSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Track whether we've already seeded profile data to avoid re-triggering
  const profileSeeded = useRef(false)

  // For candidates: auto-seed resume data from profile
  useEffect(() => {
    if (!isCandidate || !profile || profileSeeded.current) return
    if (resumeData) {
      // Already have resume data (from previous upload or session)
      profileSeeded.current = true
      return
    }

    const converted: ResumeData = {
      headline: profile.headline,
      bio: profile.bio,
      skills: profile.skills,
      experienceYears: profile.experienceYears,
      location: profile.location,
    }

    // Only seed if the profile has meaningful data
    if (converted.skills.length > 0 || converted.headline || converted.bio) {
      setResumeData(converted)
      profileSeeded.current = true
    }
  }, [isCandidate, profile, resumeData, setResumeData])

  // Generate summary when resumeData exists but no cached summary for this job
  useEffect(() => {
    if (!resumeData) {
      setStatus('idle')
      setSummaryState(null)
      return
    }

    const cached = getSummary(jobData.id)
    if (cached) {
      setSummaryState(cached.summary)
      setStatus('ready')
      return
    }

    let cancelled = false

    async function generate() {
      setStatus('generating')
      setError(null)

      try {
        const res = await fetch('/api/relevance/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeData, jobData }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error ?? 'Failed to generate relevance summary')
        }

        const result: RelevanceSummary = await res.json()
        if (cancelled) return

        setSummary(jobData.id, { summary: result, generatedAt: Date.now() })
        setSummaryState(result)
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setStatus('error')
      }
    }

    generate()

    return () => {
      cancelled = true
    }
  }, [resumeData, jobData, getSummary, setSummary])

  const handleFileUpload = useCallback(
    async (file: File) => {
      setStatus('parsing')
      setError(null)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/relevance/parse-resume', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error ?? 'Failed to parse resume')
        }

        const parsed: ResumeData = await res.json()
        setResumeData(parsed)
        // The useEffect above will auto-trigger summary generation
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse resume')
        setStatus('error')
      }
    },
    [setResumeData]
  )

  const handleChangeResume = useCallback(() => {
    clearResumeData()
    profileSeeded.current = false
    setSummaryState(null)
    setError(null)
    setStatus('idle')
  }, [clearResumeData])

  return {
    status,
    summary,
    error,
    hasResumeData: resumeData !== null,
    handleFileUpload,
    handleChangeResume,
    isCandidate,
  }
}
