import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRecruiterInterviews,
  scheduleInterview,
  cancelInterview,
  rescheduleInterview,
  submitInterviewFeedback,
} from '@/actions/recruiter-interviews'
import type { ScheduleInterviewInput } from '@/actions/recruiter-interviews'

export const recruiterInterviewKeys = {
  all: ['recruiter-interviews'] as const,
  list: () => [...recruiterInterviewKeys.all, 'list'] as const,
}

export function useRecruiterInterviews() {
  return useQuery({
    queryKey: recruiterInterviewKeys.list(),
    queryFn: () => getRecruiterInterviews(),
  })
}

export function useScheduleInterview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ScheduleInterviewInput) => scheduleInterview(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterInterviewKeys.all })
    },
  })
}

export function useCancelInterview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (interviewId: string) => cancelInterview(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterInterviewKeys.all })
    },
  })
}

export function useSubmitInterviewFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      interviewId: string
      rating: number
      feedback: string
    }) => submitInterviewFeedback(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterInterviewKeys.all })
    },
  })
}

export function useRescheduleInterview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      interviewId,
      newDate,
      newDuration,
    }: {
      interviewId: string
      newDate: string
      newDuration?: number
    }) => rescheduleInterview(interviewId, newDate, newDuration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterInterviewKeys.all })
    },
  })
}
