import { useMutation } from '@tanstack/react-query'
import { sendEmailToCandidate } from '@/actions/send-email'

export function useSendEmail() {
  return useMutation({
    mutationFn: (input: {
      candidateEmail: string
      candidateName: string
      subject: string
      body: string
    }) => sendEmailToCandidate(input),
  })
}
