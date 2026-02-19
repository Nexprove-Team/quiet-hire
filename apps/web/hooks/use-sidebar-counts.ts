import { useQuery } from '@tanstack/react-query'
import { getSidebarCounts } from '@/actions/sidebar-counts'

export const sidebarCountKeys = {
  all: ['sidebar-counts'] as const,
}

export function useSidebarCounts() {
  return useQuery({
    queryKey: sidebarCountKeys.all,
    queryFn: () => getSidebarCounts(),
    staleTime: 30_000,
  })
}
