import { useQuery } from '@tanstack/react-query'
import {
  getRecruiterCandidates,
  getRecruiterCandidateDetail,
} from '@/actions/recruiter-candidates'

export const recruiterCandidateKeys = {
  all: ['recruiter-candidates'] as const,
  list: () => [...recruiterCandidateKeys.all, 'list'] as const,
  detail: (applicationId: string) =>
    [...recruiterCandidateKeys.all, 'detail', applicationId] as const,
}

export function useRecruiterCandidates() {
  return useQuery({
    queryKey: recruiterCandidateKeys.list(),
    queryFn: () => getRecruiterCandidates(),
  })
}

export function useRecruiterCandidateDetail(applicationId: string) {
  return useQuery({
    queryKey: recruiterCandidateKeys.detail(applicationId),
    queryFn: () => getRecruiterCandidateDetail(applicationId),
    enabled: !!applicationId,
  })
}
