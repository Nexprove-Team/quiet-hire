import { create } from 'zustand'
import type { ResumeData, CachedRelevance } from './types'

const RESUME_KEY = 'relevance-resume-data'
const SUMMARIES_KEY = 'relevance-summaries'

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — silently ignore
  }
}

function removeKey(key: string) {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

interface RelevanceStoreState {
  resumeData: ResumeData | null
  summaries: Record<string, CachedRelevance>
  setResumeData: (data: ResumeData) => void
  clearResumeData: () => void
  getSummary: (jobId: string) => CachedRelevance | null
  setSummary: (jobId: string, cached: CachedRelevance) => void
}

export const useRelevanceStore = create<RelevanceStoreState>((set, get) => ({
  resumeData: readJson<ResumeData>(RESUME_KEY),
  summaries: readJson<Record<string, CachedRelevance>>(SUMMARIES_KEY) ?? {},

  setResumeData: (data) => {
    writeJson(RESUME_KEY, data)
    // Resume changed → clear all cached summaries
    removeKey(SUMMARIES_KEY)
    set({ resumeData: data, summaries: {} })
  },

  clearResumeData: () => {
    removeKey(RESUME_KEY)
    removeKey(SUMMARIES_KEY)
    set({ resumeData: null, summaries: {} })
  },

  getSummary: (jobId) => {
    return get().summaries[jobId] ?? null
  },

  setSummary: (jobId, cached) => {
    const next = { ...get().summaries, [jobId]: cached }
    writeJson(SUMMARIES_KEY, next)
    set({ summaries: next })
  },
}))
