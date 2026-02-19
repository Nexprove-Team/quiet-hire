import { useQuery } from '@tanstack/react-query'
import {
  getCandidateApplications,
  getCandidateApplication,
} from '@/actions/applications'

export const applicationKeys = {
  all: ['applications'] as const,
  list: () => [...applicationKeys.all, 'list'] as const,
  detail: (id: string) => [...applicationKeys.all, 'detail', id] as const,
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
