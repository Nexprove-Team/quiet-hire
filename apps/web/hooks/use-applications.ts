import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCandidateApplications,
  getCandidateApplication,
  hasAppliedToJob,
  generateMatchAnalysis,
} from '@/actions/applications'

export const applicationKeys = {
  all: ['applications'] as const,
  list: () => [...applicationKeys.all, 'list'] as const,
  detail: (id: string) => [...applicationKeys.all, 'detail', id] as const,
  hasApplied: (jobId: string) =>
    [...applicationKeys.all, 'has-applied', jobId] as const,
}

export function useApplications() {
  return useQuery({
    queryKey: applicationKeys.list(),
    queryFn: () => getCandidateApplications(),
  })
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: applicationKeys.detail(id),
    queryFn: () => getCandidateApplication(id),
  })
}

export function useHasApplied(jobId: string) {
  return useQuery({
    queryKey: applicationKeys.hasApplied(jobId),
    queryFn: () => hasAppliedToJob(jobId),
    enabled: !!jobId,
  })
}

export function useGenerateMatchAnalysis() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId: string) => generateMatchAnalysis(applicationId),
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries({
        queryKey: applicationKeys.detail(applicationId),
      })
    },
  })
}
