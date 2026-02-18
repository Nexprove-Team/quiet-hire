import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCandidateProfile,
  updateCandidateProfile,
  type UpdateCandidateProfileInput,
} from '@/actions/profile'

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
}

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: () => getCandidateProfile(),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateCandidateProfileInput) =>
      updateCandidateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    },
  })
}
