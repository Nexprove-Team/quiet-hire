import { useQuery } from '@tanstack/react-query'
import { getRecruiterDashboard } from '@/actions/recruiter-dashboard'

export const recruiterDashboardKeys = {
  all: ['recruiter-dashboard'] as const,
  data: () => [...recruiterDashboardKeys.all, 'data'] as const,
}

export function useRecruiterDashboard() {
  return useQuery({
    queryKey: recruiterDashboardKeys.data(),
    queryFn: () => getRecruiterDashboard(),
  })
}
