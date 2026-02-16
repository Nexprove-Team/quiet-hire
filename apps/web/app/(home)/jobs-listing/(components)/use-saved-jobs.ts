import { create } from 'zustand'

interface SavedJobsState {
  saved: Record<string, boolean>
  toggle: (id: string) => void
  isSaved: (id: string) => boolean
}

export const useSavedJobs = create<SavedJobsState>((set, get) => ({
  saved: {},
  toggle: (id) =>
    set((state) => ({
      saved: { ...state.saved, [id]: !state.saved[id] },
    })),
  isSaved: (id) => get().saved[id] ?? false,
}))
