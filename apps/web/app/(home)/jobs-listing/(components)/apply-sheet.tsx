'use client'

import { useState, useRef, useEffect } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@hackhyre/ui/components/sheet'
import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Label } from '@hackhyre/ui/components/label'
import { Textarea } from '@hackhyre/ui/components/textarea'
import { Checkbox } from '@hackhyre/ui/components/checkbox'
import { Separator } from '@hackhyre/ui/components/separator'
import {
  Send,
  TickCircle,
  DocumentText,
  LinkIcon,
  Sms,
  User,
  Briefcase,
  CloseCircle,
} from '@hackhyre/ui/icons'
import { useApplySheet } from './use-apply-sheet'
import { submitApplication } from '@/actions/applications'
import { useProfile } from '@/hooks/use-profile'

// ── Force light mode via CSS variable overrides ───────────────────────

const LIGHT_VARS: React.CSSProperties = {
  '--background': 'oklch(0.985 0 0)',
  '--foreground': 'oklch(0.145 0.005 285)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.145 0.005 285)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.145 0.005 285)',
  '--secondary': 'oklch(0.955 0.003 260)',
  '--secondary-foreground': 'oklch(0.205 0.005 260)',
  '--muted': 'oklch(0.955 0.003 260)',
  '--muted-foreground': 'oklch(0.52 0.01 260)',
  '--accent': 'oklch(0.955 0.04 155)',
  '--accent-foreground': 'oklch(0.145 0.005 285)',
  '--destructive': 'oklch(0.58 0.22 25)',
  '--destructive-foreground': 'oklch(0.985 0 0)',
  '--border': 'oklch(0.92 0.005 260)',
  '--input': 'oklch(0.92 0.005 260)',
  colorScheme: 'light',
} as React.CSSProperties

// ── Form State ─────────────────────────────────────────────────────────

interface FormData {
  name: string
  email: string
  linkedinUrl: string
  coverLetter: string
  talentPoolOptIn: boolean
  resumeFile: File | null
  existingResumeUrl: string | null
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  linkedinUrl: '',
  coverLetter: '',
  talentPoolOptIn: false,
  resumeFile: null,
  existingResumeUrl: null,
}

// ── Sheet ─────────────────────────────────────────────────────────────

const SHEET_CLASSES =
  'w-full sm:w-[520px] sm:max-w-[520px] p-0 flex flex-col inset-0 sm:inset-y-3 sm:right-3 sm:left-auto h-dvh sm:h-[calc(100dvh-1.5rem)] rounded-none sm:rounded-2xl border-0 sm:border bg-white text-neutral-900'

export function ApplySheet() {
  const { isOpen, jobId, jobTitle, company, close } = useApplySheet()
  const { data: profile } = useProfile()
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const didPrefill = useRef(false)

  useEffect(() => {
    if (isOpen && profile && !didPrefill.current) {
      didPrefill.current = true
      setForm((prev) => ({
        ...prev,
        name: prev.name || profile.name || '',
        email: prev.email || profile.email || '',
        linkedinUrl: prev.linkedinUrl || profile.linkedinUrl || '',
        existingResumeUrl: profile.resumeUrl || null,
      }))
    }
    if (!isOpen) {
      didPrefill.current = false
    }
  }, [isOpen, profile])

  const update = (patch: Partial<FormData>) =>
    setForm((prev) => ({ ...prev, ...patch }))

  const isValid: boolean = !!(form.name.trim() && form.email.trim())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || !jobId) return

    setSubmitting(true)
    setError(null)

    try {
      // Upload resume if present, otherwise use existing profile resume
      let resumeUrl: string | undefined
      if (form.resumeFile) {
        const fd = new window.FormData()
        fd.append('file', form.resumeFile)
        fd.append('jobId', jobId)

        const uploadRes = await fetch('/api/applications/upload', {
          method: 'POST',
          body: fd,
        })
        const uploadData = await uploadRes.json()

        if (!uploadRes.ok) {
          setError(uploadData.error ?? 'Failed to upload resume.')
          setSubmitting(false)
          return
        }
        resumeUrl = uploadData.url
      } else if (form.existingResumeUrl) {
        resumeUrl = form.existingResumeUrl
      }

      // Submit application
      const result = await submitApplication({
        jobId,
        candidateName: form.name.trim(),
        candidateEmail: form.email.trim(),
        resumeUrl,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        coverLetter: form.coverLetter.trim() || undefined,
        talentPoolOptIn: form.talentPoolOptIn,
      })

      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    close()
    setTimeout(() => {
      setForm(INITIAL_FORM)
      setSubmitted(false)
      setError(null)
      setSubmitting(false)
    }, 300)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="right"
        className={SHEET_CLASSES}
        style={LIGHT_VARS}
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Apply for {jobTitle}</SheetTitle>

        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-neutral-900">
              {submitted ? 'Application Submitted' : 'Apply for this role'}
            </h3>
            <p className="mt-0.5 truncate text-[12px] text-neutral-500">
              {jobTitle} at {company}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
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
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {submitted ? (
            <SuccessView onClose={handleClose} />
          ) : (
            <ApplicationForm
              form={form}
              update={update}
              submitting={submitting}
              isValid={isValid}
              error={error}
              fileInputRef={fileInputRef}
              onSubmit={handleSubmit}
              existingResumeUrl={form.existingResumeUrl}
              onClearExistingResume={() =>
                update({ existingResumeUrl: null })
              }
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Application Form ──────────────────────────────────────────────────

function ApplicationForm({
  form,
  update,
  submitting,
  isValid,
  error,
  fileInputRef,
  onSubmit,
  existingResumeUrl,
  onClearExistingResume,
}: {
  form: FormData
  update: (patch: Partial<FormData>) => void
  submitting: boolean
  isValid: boolean
  error: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onSubmit: (e: React.SyntheticEvent) => void
  existingResumeUrl: string | null
  onClearExistingResume: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="px-5 py-5">
      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="name"
            className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700"
          >
            <User size={12} variant="Linear" className="text-neutral-400" />
            Full Name <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="John Doe"
            className="focus-visible:ring-primary h-10 rounded-lg border-neutral-200 bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700"
          >
            <Sms size={12} variant="Linear" className="text-neutral-400" />
            Email Address <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="john@example.com"
            className="focus-visible:ring-primary h-10 rounded-lg border-neutral-200 bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        {/* Resume Upload */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700">
            <DocumentText
              size={12}
              variant="Linear"
              className="text-neutral-400"
            />
            Resume
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              update({ resumeFile: file })
            }}
          />
          {form.resumeFile ? (
            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
              <DocumentText
                size={16}
                variant="Bold"
                className="text-primary shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-neutral-900">
                  {form.resumeFile.name}
                </p>
                <p className="text-[10px] text-neutral-500">
                  {(form.resumeFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  update({ resumeFile: null })
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="shrink-0 text-neutral-400 hover:text-neutral-900"
              >
                <CloseCircle size={16} variant="Linear" />
              </button>
            </div>
          ) : existingResumeUrl ? (
            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
              <DocumentText
                size={16}
                variant="Bold"
                className="text-primary shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-neutral-900">
                  Resume from profile
                </p>
                <p className="text-[10px] text-neutral-500">
                  Attached from your profile
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 text-[11px] font-medium text-neutral-500 hover:text-neutral-900"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onClearExistingResume}
                className="shrink-0 text-neutral-400 hover:text-neutral-900"
              >
                <CloseCircle size={16} variant="Linear" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="hover:border-primary hover:bg-primary/5 flex w-full flex-col items-center gap-1.5 rounded-lg border border-dashed border-neutral-300 bg-neutral-50/50 px-4 py-5 transition-colors"
            >
              <DocumentText
                size={20}
                variant="Linear"
                className="text-neutral-400"
              />
              <span className="text-[12px] font-medium text-neutral-600">
                Click to upload your resume
              </span>
              <span className="text-[10px] text-neutral-400">
                PDF, DOC, or DOCX (max 5MB)
              </span>
            </button>
          )}
        </div>

        {/* LinkedIn URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor="linkedin"
            className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700"
          >
            <LinkIcon size={12} variant="Linear" className="text-neutral-400" />
            LinkedIn Profile
          </Label>
          <Input
            id="linkedin"
            value={form.linkedinUrl}
            onChange={(e) => update({ linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/yourprofile"
            className="focus-visible:ring-primary h-10 rounded-lg border-neutral-200 bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        {/* Cover Letter */}
        <div className="space-y-1.5">
          <Label
            htmlFor="cover"
            className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700"
          >
            <Briefcase
              size={12}
              variant="Linear"
              className="text-neutral-400"
            />
            Why are you interested?
          </Label>
          <Textarea
            id="cover"
            value={form.coverLetter}
            onChange={(e) => update({ coverLetter: e.target.value })}
            placeholder="Tell us why you're a great fit for this role..."
            rows={4}
            className="focus-visible:ring-primary resize-none rounded-lg border-neutral-200 bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        <Separator className="bg-neutral-200" />

        {/* Talent Pool Opt-in */}
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3.5">
          <Checkbox
            checked={form.talentPoolOptIn}
            onCheckedChange={(checked) =>
              update({ talentPoolOptIn: !!checked })
            }
            className="data-[state=checked]:border-primary data-[state=checked]:bg-primary mt-0.5 border-neutral-300 bg-white"
          />
          <div>
            <p className="text-[12px] font-medium text-neutral-900">
              Keep me in the talent pool
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500">
              Even if I&apos;m not selected for this role, I&apos;d like to be
              considered for future opportunities that match my profile.
            </p>
          </div>
        </label>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] text-rose-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={!isValid || submitting}
          className="bg-primary hover:bg-primary/90 w-full gap-2 rounded-lg py-2.5 text-[13px] font-semibold text-neutral-900 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-900/20 border-t-neutral-900" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={14} variant="Linear" />
              Submit Application
            </>
          )}
        </Button>

        <p className="text-center text-[10px] leading-relaxed text-neutral-400">
          By submitting, you agree to our privacy policy. Your data will only be
          shared with the hiring team for this position
          {form.talentPoolOptIn ? ' and for future matching opportunities' : ''}
          .
        </p>
      </div>
    </form>
  )
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-5 py-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <TickCircle size={32} variant="Bold" className="text-emerald-500" />
        </div>

        <h3 className="mt-4 text-[16px] font-bold text-neutral-900">
          Application Submitted
        </h3>
        <p className="mt-2 text-[12px] leading-relaxed text-neutral-600">
          Your application has been received and will be reviewed by the hiring
          team shortly.
        </p>
      </div>

      <Separator className="my-5 bg-neutral-200" />

      {/* What happens next */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <h4 className="mb-2 text-[12px] font-semibold text-neutral-900">
          What happens next?
        </h4>
        <div className="space-y-2.5">
          {[
            'Your application is being reviewed by the hiring team',
            "You'll receive an email update within 5 business days",
            "If shortlisted, you'll be contacted for next steps",
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 text-[11px] text-neutral-600"
            >
              <span className="bg-primary/15 text-primary flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onClose}
        className="mt-5 w-full gap-2 rounded-lg bg-neutral-900 text-[13px] font-semibold text-white hover:bg-neutral-800"
      >
        Done
      </Button>
    </div>
  )
}
