import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPublicJobs,
  getJobById,
  getCompanyJobs,
  getCompanyByName,
  getFeaturedJobs,
  getTopCompanies,
} from '@/actions/jobs'
import type { JobFilters } from '@/actions/jobs'
import {
  createJob,
  updateJob,
  deleteJob,
} from '@/actions/job-mutations'
import type { CreateJobInput, UpdateJobInput } from '@/actions/job-mutations'
import { recruiterJobKeys } from '@/hooks/use-recruiter-jobs'

export const jobKeys = {
  all: ['jobs'] as const,
  list: (filters: JobFilters) => [...jobKeys.all, 'list', filters] as const,
  detail: (id: string) => [...jobKeys.all, 'detail', id] as const,
  companyJobs: (name: string) => [...jobKeys.all, 'company', name] as const,
  companyProfile: (name: string) =>
    [...jobKeys.all, 'company-profile', name] as const,
  featured: () => [...jobKeys.all, 'featured'] as const,
  topCompanies: () => [...jobKeys.all, 'top-companies'] as const,
}

export function usePublicJobs(filters: JobFilters) {
  return useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: () => getPublicJobs(filters),
  })
}

export function useJobById(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => getJobById(id),
    enabled: !!id,
  })
}

export function useCompanyProfile(companyName: string) {
  return useQuery({
    queryKey: jobKeys.companyProfile(companyName),
    queryFn: () => getCompanyByName(companyName),
    enabled: !!companyName,
  })
}

export function useCompanyJobs(companyName: string) {
  return useQuery({
    queryKey: jobKeys.companyJobs(companyName),
    queryFn: () => getCompanyJobs(companyName),
    enabled: !!companyName,
  })
}

export function useFeaturedJobs() {
  return useQuery({
    queryKey: jobKeys.featured(),
    queryFn: () => getFeaturedJobs(),
  })
}

export function useTopCompanies() {
  return useQuery({
    queryKey: jobKeys.topCompanies(),
    queryFn: () => getTopCompanies(),
  })
}

// ── Mutations ──────────────────────────────────────────────────────────────────

export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateJobInput) => createJob(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all })
    },
  })
}

export function useUpdateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateJobInput) => updateJob(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all })
      queryClient.invalidateQueries({ queryKey: recruiterJobKeys.all })
    },
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all })
    },
  })
}
