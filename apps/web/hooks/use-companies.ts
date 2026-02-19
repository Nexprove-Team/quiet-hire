import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRecruiterCompanies,
  createCompany,
} from '@/actions/job-mutations'

export const companyKeys = {
  all: ['companies'] as const,
  recruiter: () => [...companyKeys.all, 'recruiter'] as const,
}

export function useRecruiterCompanies() {
  return useQuery({
    queryKey: companyKeys.recruiter(),
    queryFn: () => getRecruiterCompanies(),
    staleTime: 60_000,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; website?: string; description?: string }) =>
      createCompany(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
    },
  })
}
