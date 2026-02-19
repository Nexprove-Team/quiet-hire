'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { create } from 'zustand'

import { Sheet, SheetContent, SheetTitle } from '@hackhyre/ui/components/sheet'
import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Textarea } from '@hackhyre/ui/components/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hackhyre/ui/components/form'
import { Send } from '@hackhyre/ui/icons'
import { useSendEmail } from '@/hooks/use-send-email'

// ── Store ────────────────────────────────────────────────────────────

interface ComposeEmailPrefill {
  to: string
  candidateName: string
}

interface ComposeEmailSheetState {
  isOpen: boolean
  prefill: ComposeEmailPrefill | null
  open: (prefill: ComposeEmailPrefill) => void
  close: () => void
}

export const useComposeEmailSheet = create<ComposeEmailSheetState>(
  (set) => ({
    isOpen: false,
    prefill: null,
    open: (prefill) => set({ isOpen: true, prefill }),
    close: () => set({ isOpen: false, prefill: null }),
  })
)

// ── Schema ───────────────────────────────────────────────────────────

const schema = z.object({
  to: z.email('Enter a valid email'),
  candidateName: z.string().min(1),
  subject: z.string().min(1, 'Enter a subject'),
  body: z.string().min(1, 'Enter a message'),
})

type FormValues = z.infer<typeof schema>

// ── Component ────────────────────────────────────────────────────────

const SHEET_CLASSES =
  'w-full sm:w-[480px] sm:max-w-[480px] p-0 flex flex-col inset-0 sm:inset-y-3 sm:right-3 sm:left-auto h-dvh sm:h-[calc(100dvh-1.5rem)] rounded-none sm:rounded-2xl border-0 sm:border'

export function ComposeEmailSheet() {
  const { isOpen, prefill, close } = useComposeEmailSheet()
  const sendEmail = useSendEmail()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      to: prefill?.to ?? '',
      candidateName: prefill?.candidateName ?? '',
      subject: '',
      body: '',
    },
  })

  function onSubmit(values: FormValues) {
    sendEmail.mutate(
      {
        candidateEmail: values.to,
        candidateName: values.candidateName,
        subject: values.subject,
        body: values.body,
      },
      {
        onSuccess: () => {
          toast.success('Email sent!', {
            description: `Email sent to ${values.candidateName}`,
          })
          form.reset()
          close()
        },
        onError: (error) => {
          toast.error('Failed to send email', {
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
        <SheetTitle className="sr-only">Compose Email</SheetTitle>

        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between border-b px-4 pt-4 pb-3">
          <h3 className="text-[15px] font-semibold">Compose Email</h3>
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                id="compose-email-form"
              >
                {/* To */}
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px]">To</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="candidate@example.com"
                          readOnly
                          className="bg-muted/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px]">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Following up on your application"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Body */}
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px]">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your message..."
                          rows={8}
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
              form="compose-email-form"
              className="flex-1 gap-2 text-[12px]"
              disabled={sendEmail.isPending}
            >
              <Send size={14} variant="Linear" />
              {sendEmail.isPending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
