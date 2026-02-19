'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { create } from 'zustand'

import { Sheet, SheetContent, SheetTitle } from '@hackhyre/ui/components/sheet'
import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Textarea } from '@hackhyre/ui/components/textarea'
import { Calendar as CalendarPicker } from '@hackhyre/ui/components/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@hackhyre/ui/components/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hackhyre/ui/components/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hackhyre/ui/components/form'
import { Separator } from '@hackhyre/ui/components/separator'
import {
  Calendar,
  Clock,
  People,
  Briefcase,
  Notepad,
  InfoCircle,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { useRecruiterJobs } from '@/hooks/use-recruiter-jobs'
import { useScheduleInterview } from '@/hooks/use-recruiter-interviews'
import {
  checkGoogleCalendarConnection,
  getGoogleAuthUrl,
} from '@/actions/google-oauth'

// ── Store ────────────────────────────────────────────────────────────

interface ScheduleInterviewPrefill {
  candidateName?: string
  candidateEmail?: string
}

interface ScheduleInterviewSheetState {
  isOpen: boolean
  prefill: ScheduleInterviewPrefill | null
  open: (prefill?: ScheduleInterviewPrefill) => void
  close: () => void
}

export const useScheduleInterviewSheet = create<ScheduleInterviewSheetState>(
  (set) => ({
    isOpen: false,
    prefill: null,
    open: (prefill) => set({ isOpen: true, prefill: prefill ?? null }),
    close: () => set({ isOpen: false, prefill: null }),
  })
)

// ── Schema ───────────────────────────────────────────────────────────

const schema = z.object({
  candidateName: z.string().min(1, 'Enter candidate name'),
  candidateEmail: z.email('Enter a valid email'),
  jobId: z.string().min(1, 'Select a position'),
  date: z.date({ message: 'Select a date' }),
  time: z.string().min(1, 'Enter a time'),
  duration: z.string().min(1, 'Select duration'),
  interviewType: z.string().min(1, 'Select interview type'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

// ── Component ────────────────────────────────────────────────────────

const SHEET_CLASSES =
  'w-full sm:w-[480px] sm:max-w-[480px] p-0 flex flex-col inset-0 sm:inset-y-3 sm:right-3 sm:left-auto h-dvh sm:h-[calc(100dvh-1.5rem)] rounded-none sm:rounded-2xl border-0 sm:border'

export function ScheduleInterviewSheet() {
  const { isOpen, prefill, close } = useScheduleInterviewSheet()
  const { data: recruiterJobs } = useRecruiterJobs()
  const scheduleInterview = useScheduleInterview()
  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      checkGoogleCalendarConnection().then(setGoogleConnected)
    }
  }, [isOpen])

  // Listen for popup OAuth callback
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'google-oauth') {
        if (event.data.status === 'connected') {
          setGoogleConnected(true)
          setConnecting(false)
          toast.success('Google Calendar connected!')
        } else {
          setConnecting(false)
          toast.error('Failed to connect Google Calendar')
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  async function handleConnectGoogle() {
    setConnecting(true)
    try {
      const url = await getGoogleAuthUrl()
      const w = 500
      const h = 600
      const left = window.screenX + (window.outerWidth - w) / 2
      const top = window.screenY + (window.outerHeight - h) / 2
      const popup = window.open(
        url,
        'google-oauth',
        `width=${w},height=${h},left=${left},top=${top},popup=yes`
      )
      // If popup was blocked, fall back
      if (!popup) {
        window.location.href = url
      }
    } catch {
      setConnecting(false)
      toast.error('Failed to start Google connection')
    }
  }

  const openJobs = recruiterJobs?.filter((j) => j.status === 'open') ?? []

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      candidateName: '',
      candidateEmail: '',
      jobId: '',
      date: undefined,
      time: '',
      duration: '30',
      interviewType: 'screening',
      notes: '',
    },
  })

  // Apply prefill when sheet opens with pre-filled data
  useEffect(() => {
    if (isOpen && prefill) {
      if (prefill.candidateName) form.setValue('candidateName', prefill.candidateName)
      if (prefill.candidateEmail) form.setValue('candidateEmail', prefill.candidateEmail)
    }
  }, [isOpen, prefill, form])

  function onSubmit(values: FormValues) {
    const scheduledAt = new Date(values.date)
    const [hours, minutes] = values.time.split(':').map(Number)
    scheduledAt.setHours(hours!, minutes!, 0, 0)

    scheduleInterview.mutate(
      {
        jobId: values.jobId,
        candidateName: values.candidateName,
        candidateEmail: values.candidateEmail,
        scheduledAt: scheduledAt.toISOString(),
        duration: parseInt(values.duration, 10),
        interviewType: values.interviewType as
          | 'screening'
          | 'technical'
          | 'behavioral'
          | 'final',
        notes: values.notes || undefined,
      },
      {
        onSuccess: (data) => {
          toast.success('Interview scheduled!', {
            description: `Interview with ${values.candidateName} has been scheduled.${
              data.meetLink
                ? ''
                : ' No Google Meet link — connect Google Calendar in Settings.'
            }`,
          })
          form.reset()
          close()
        },
        onError: (error) => {
          toast.error('Failed to schedule interview', {
            description: error.message,
          })
        },
      }
    )
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset()
          close()
        }
      }}
    >
      <SheetContent
        side="right"
        className={SHEET_CLASSES}
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Schedule Interview</SheetTitle>

        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between border-b px-4 pt-4 pb-3">
          <h3 className="text-[15px] font-semibold">Schedule Interview</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={() => {
              form.reset()
              close()
            }}
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

        {/* Scrollable form body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-6 py-5">
            {/* Google Calendar status banner */}
            {googleConnected === false && (
              <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                <div className="flex items-start gap-2">
                  <InfoCircle
                    size={14}
                    variant="Linear"
                    className="mt-0.5 shrink-0 text-amber-600"
                  />
                  <div className="flex-1">
                    <p className="text-[11px] leading-4 text-amber-700 dark:text-amber-400">
                      Connect Google Calendar to auto-generate Meet links for
                      interviews.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 gap-1.5 border-amber-300 bg-white text-[11px] text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      disabled={connecting}
                      onClick={handleConnectGoogle}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      {connecting ? 'Connecting...' : 'Connect Google Calendar'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                id="schedule-interview-form"
              >
                {/* Candidate Name */}
                <FormField
                  control={form.control}
                  name="candidateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-[12px]">
                        <People
                          size={13}
                          variant="Linear"
                          className="text-muted-foreground"
                        />
                        Candidate Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Alex Johnson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Candidate Email */}
                <FormField
                  control={form.control}
                  name="candidateEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px]">
                        Candidate Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="alex@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Job */}
                <FormField
                  control={form.control}
                  name="jobId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-[12px]">
                        <Briefcase
                          size={13}
                          variant="Linear"
                          className="text-muted-foreground"
                        />
                        Position
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {openJobs.map((j) => (
                            <SelectItem key={j.id} value={j.id}>
                              {j.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Date & Time row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Date Picker */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-1.5 text-[12px]">
                          <Calendar
                            size={13}
                            variant="Linear"
                            className="text-muted-foreground"
                          />
                          Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left text-[12px] font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? format(field.value, 'MMM d, yyyy')
                                  : 'Pick a date'}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0"
                            align="start"
                          >
                            <CalendarPicker
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date <
                                new Date(new Date().setHours(0, 0, 0, 0))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-[12px]">
                          <Clock
                            size={13}
                            variant="Linear"
                            className="text-muted-foreground"
                          />
                          Time
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Duration & Type row */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px]">Duration</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interviewType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px]">Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="screening">Screening</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="behavioral">
                              Behavioral
                            </SelectItem>
                            <SelectItem value="final">Final Round</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-[12px]">
                        <Notepad
                          size={13}
                          variant="Linear"
                          className="text-muted-foreground"
                        />
                        Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any preparation notes or topics to discuss..."
                          rows={3}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t px-6 py-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 text-[12px]"
              onClick={() => {
                form.reset()
                close()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="schedule-interview-form"
              className="flex-1 text-[12px]"
              disabled={scheduleInterview.isPending}
            >
              {scheduleInterview.isPending
                ? 'Scheduling...'
                : 'Schedule Interview'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
