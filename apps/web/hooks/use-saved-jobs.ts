import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSavedJobs,
  getSavedJobIds,
  getIsSaved,
  toggleSaveJob,
} from '@/actions/saved-jobs'

export const savedJobKeys = {
  all: ['saved-jobs'] as const,
  list: () => [...savedJobKeys.all, 'list'] as const,
  ids: () => [...savedJobKeys.all, 'ids'] as const,
  check: (jobId: string) => [...savedJobKeys.all, 'check', jobId] as const,
}

export function useSavedJobsList() {
  return useQuery({
    queryKey: savedJobKeys.list(),
    queryFn: () => getSavedJobs(),
  })
}

export function useSavedJobIds() {
  return useQuery({
    queryKey: savedJobKeys.ids(),
    queryFn: () => getSavedJobIds(),
  })
}

export function useIsSaved(jobId: string) {
  return useQuery({
    queryKey: savedJobKeys.check(jobId),
    queryFn: () => getIsSaved(jobId),
    enabled: !!jobId,
  })
}

export function useToggleSaveJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobId: string) => toggleSaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedJobKeys.all })
    },
  })
}
