'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@hackhyre/ui/components/sheet'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import { Badge } from '@hackhyre/ui/components/badge'
import { Button } from '@hackhyre/ui/components/button'
import { Separator } from '@hackhyre/ui/components/separator'
import { Textarea } from '@hackhyre/ui/components/textarea'
import {
  Calendar,
  Clock,
  Briefcase,
  Copy,
  Play,
  Notepad,
  ArrowLeft,
  ArrowRight,
  LinkIcon,
  InfoCircle,
  Star,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { toast } from 'sonner'
import { create } from 'zustand'
import {
  INTERVIEW_STATUS_CONFIG,
  INTERVIEW_TYPE_CONFIG,
} from '@/lib/constants'
import {
  useRecruiterInterviews,
  useCancelInterview,
  useSubmitInterviewFeedback,
} from '@/hooks/use-recruiter-interviews'
import type { RecruiterInterview } from '@/actions/recruiter-interviews'

// ── Store ────────────────────────────────────────────────────────────

interface InterviewSheetState {
  isOpen: boolean
  interviewId: string | null
  interviewIds: string[]
  open: (id: string, ids?: string[]) => void
  close: () => void
  navigateNext: () => void
  navigatePrev: () => void
}

export const useInterviewSheet = create<InterviewSheetState>((set, get) => ({
  isOpen: false,
  interviewId: null,
  interviewIds: [],
  open: (id, ids = []) => set({ isOpen: true, interviewId: id, interviewIds: ids }),
  close: () => set({ isOpen: false, interviewId: null }),
  navigateNext: () => {
    const { interviewId, interviewIds } = get()
    if (!interviewId) return
    const idx = interviewIds.indexOf(interviewId)
    if (idx >= 0 && idx < interviewIds.length - 1) {
      set({ interviewId: interviewIds[idx + 1] })
    }
  },
  navigatePrev: () => {
    const { interviewId, interviewIds } = get()
    if (!interviewId) return
    const idx = interviewIds.indexOf(interviewId)
    if (idx > 0) {
      set({ interviewId: interviewIds[idx - 1] })
    }
  },
}))

// ── Component ────────────────────────────────────────────────────────

const SHEET_CLASSES =
  'w-full sm:w-[480px] sm:max-w-[480px] p-0 flex flex-col inset-0 sm:inset-y-3 sm:right-3 sm:left-auto h-dvh sm:h-[calc(100dvh-1.5rem)] rounded-none sm:rounded-2xl border-0 sm:border'

function formatDateTime(date: Date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) +
    ' at ' +
    d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
}

// ── Feedback Form ────────────────────────────────────────────────────

function InterviewFeedbackForm({ interviewId }: { interviewId: string }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const submitFeedback = useSubmitInterviewFeedback()

  const displayRating = hoveredRating || rating

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className="p-0.5 transition-transform hover:scale-110"
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(value)}
          >
            <Star
              size={20}
              variant={value <= displayRating ? 'Bold' : 'Linear'}
              className={cn(
                'transition-colors',
                value <= displayRating
                  ? 'text-amber-500'
                  : 'text-muted-foreground/30'
              )}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-muted-foreground ml-1 text-[11px]">
            {rating}/5
          </span>
        )}
      </div>
      <Textarea
        placeholder="Share your feedback about this interview..."
        rows={3}
        className="resize-none text-[12px]"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      />
      <Button
        size="sm"
        className="w-full text-[12px]"
        disabled={rating === 0 || !feedbackText.trim() || submitFeedback.isPending}
        onClick={() => {
          submitFeedback.mutate(
            { interviewId, rating, feedback: feedbackText.trim() },
            {
              onSuccess: () => {
                toast.success('Feedback submitted')
              },
              onError: (error) => {
                toast.error('Failed to submit feedback', {
                  description: error.message,
                })
              },
            }
          )
        }}
      >
        {submitFeedback.isPending ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </div>
  )
}

export function InterviewDetailSheet() {
  const {
    isOpen,
    interviewId,
    interviewIds,
    close,
    navigateNext,
    navigatePrev,
  } = useInterviewSheet()

  const { data: allInterviews } = useRecruiterInterviews()
  const cancelMutation = useCancelInterview()

  const interview: RecruiterInterview | undefined = interviewId
    ? allInterviews?.find((i) => i.id === interviewId)
    : undefined

  const currentIndex = interviewId ? interviewIds.indexOf(interviewId) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < interviewIds.length - 1
  const showNav = interviewIds.length > 1

  if (!interview) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent
          side="right"
          className={SHEET_CLASSES}
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Interview Details</SheetTitle>
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground text-[13px]">
              Interview not found
            </p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  const initials = interview.candidateName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
  const statusConfig = INTERVIEW_STATUS_CONFIG[interview.status]
  const typeConfig = INTERVIEW_TYPE_CONFIG[interview.interviewType]
  const canJoin =
    interview.status === 'scheduled' || interview.status === 'in_progress'

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        className={SHEET_CLASSES}
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Interview Detail</SheetTitle>

        {/* Top nav bar */}
        <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-0">
          <h3 className="text-[13px] font-semibold">Interview Detail</h3>
          <div className="flex items-center gap-1">
            {showNav && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  disabled={!hasPrev}
                  onClick={navigatePrev}
                >
                  <ArrowLeft size={14} variant="Linear" />
                </Button>
                <span className="text-muted-foreground min-w-[4ch] text-center text-[11px] tabular-nums">
                  {String(currentIndex + 1).padStart(2, '0')} of{' '}
                  {String(interviewIds.length).padStart(2, '0')}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  disabled={!hasNext}
                  onClick={navigateNext}
                >
                  <ArrowRight size={14} variant="Linear" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-7 w-7 rounded-lg"
              onClick={close}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="shrink-0 border-b px-6 pt-3 pb-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[16px] font-bold">
                {interview.candidateName}
              </h2>
              <p className="text-muted-foreground mt-0.5 text-[12px]">
                {interview.jobTitle}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                {interview.candidateEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 px-6 py-5">
            {/* Meeting section */}
            <div>
              <h4 className="text-muted-foreground mb-3 text-[12px] font-semibold tracking-wider uppercase">
                Meeting
              </h4>
              <div className="space-y-3">
                {interview.meetLink ? (
                  <>
                    <div className="bg-muted/50 flex items-center justify-between rounded-xl p-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <LinkIcon
                          size={14}
                          variant="Linear"
                          className="text-primary shrink-0"
                        />
                        <span className="text-primary truncate text-[12px] font-medium">
                          {interview.meetLink}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(interview.meetLink!)
                          toast.success('Meeting link copied')
                        }}
                      >
                        <Copy size={13} variant="Linear" />
                      </Button>
                    </div>

                    {canJoin && (
                      <Button
                        className="w-full gap-2"
                        onClick={() =>
                          window.open(interview.meetLink!, '_blank')
                        }
                      >
                        <Play size={16} variant="Bold" />
                        Join Meeting
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                    <InfoCircle
                      size={14}
                      variant="Linear"
                      className="mt-0.5 shrink-0 text-amber-600"
                    />
                    <p className="text-[11px] leading-4 text-amber-700 dark:text-amber-400">
                      No Google Meet link. Connect Google Calendar in Settings
                      to auto-generate Meet links.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-muted-foreground flex items-center gap-2 text-[12px]">
                    <Calendar size={14} variant="Linear" />
                    <span>{formatDateTime(interview.scheduledAt)}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-[12px]">
                    <Clock size={14} variant="Linear" />
                    <span>{interview.duration} minutes</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-[12px]">
                    <Briefcase size={14} variant="Linear" />
                    <Badge
                      variant="outline"
                      className="text-[10px] font-medium"
                    >
                      {typeConfig?.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div>
              <h4 className="text-muted-foreground mb-3 text-[12px] font-semibold tracking-wider uppercase">
                Status
              </h4>
              <Badge
                variant={statusConfig?.variant as 'default'}
                className={cn(
                  'text-[11px] font-medium',
                  statusConfig?.className
                )}
              >
                {statusConfig?.label}
              </Badge>
            </div>

            <Separator />

            {/* Notes */}
            <div>
              <h4 className="text-muted-foreground mb-3 text-[12px] font-semibold tracking-wider uppercase">
                Notes
              </h4>
              {interview.notes ? (
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Notepad
                      size={14}
                      variant="Linear"
                      className="text-muted-foreground mt-0.5 shrink-0"
                    />
                    <p className="text-muted-foreground text-[12px] leading-relaxed">
                      {interview.notes}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground/60 text-[12px]">
                  No notes added yet
                </p>
              )}
            </div>

            {/* Feedback — only for completed interviews */}
            {interview.status === 'completed' && (
              <>
                <Separator />
                <div>
                  <h4 className="text-muted-foreground mb-3 text-[12px] font-semibold tracking-wider uppercase">
                    Feedback
                  </h4>
                  {interview.rating !== null && interview.feedback ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star
                            key={value}
                            size={16}
                            variant={
                              value <= (interview.rating ?? 0)
                                ? 'Bold'
                                : 'Linear'
                            }
                            className={cn(
                              value <= (interview.rating ?? 0)
                                ? 'text-amber-500'
                                : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                        <span className="text-muted-foreground ml-1 text-[11px]">
                          {interview.rating}/5
                        </span>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-3">
                        <p className="text-muted-foreground text-[12px] leading-relaxed">
                          {interview.feedback}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <InterviewFeedbackForm interviewId={interview.id} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions footer */}
        <div className="shrink-0 border-t px-6 py-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 text-[12px]"
              onClick={() => toast('Reschedule coming soon')}
            >
              Reschedule
            </Button>
            <Button
              variant="destructive"
              className="flex-1 text-[12px]"
              disabled={
                cancelMutation.isPending ||
                interview.status === 'cancelled'
              }
              onClick={() => {
                cancelMutation.mutate(interview.id, {
                  onSuccess: () => {
                    toast.success('Interview cancelled')
                    close()
                  },
                  onError: (error) => {
                    toast.error('Failed to cancel', {
                      description: error.message,
                    })
                  },
                })
              }}
            >
              {cancelMutation.isPending
                ? 'Cancelling...'
                : 'Cancel Interview'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
