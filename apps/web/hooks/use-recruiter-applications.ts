import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRecruiterApplications,
  updateApplicationStatus,
} from '@/actions/recruiter-applications'
import type { ApplicationStatus } from '@/actions/recruiter-applications'
import { recruiterJobKeys } from './use-recruiter-jobs'

export const recruiterApplicationKeys = {
  all: ['recruiter-applications'] as const,
  list: () => [...recruiterApplicationKeys.all, 'list'] as const,
}

export function useRecruiterApplications() {
  return useQuery({
    queryKey: recruiterApplicationKeys.list(),
    queryFn: () => getRecruiterApplications(),
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { applicationId: string; status: ApplicationStatus }) =>
      updateApplicationStatus(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: recruiterApplicationKeys.all,
      })
      queryClient.invalidateQueries({ queryKey: recruiterJobKeys.all })
    },
  })
}
