'use client'

import { ResumeDropzone } from '@/components/onboarding/resume/resume-dropzone'

interface RelevanceSummaryCTAProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function RelevanceSummaryCTA({
  onFileSelect,
  disabled,
}: RelevanceSummaryCTAProps) {
  return (
    <div className="space-y-3">
      <p className="text-[13px] leading-relaxed text-neutral-600">
        Upload your resume to see how well you match this role. Get instant
        insights on your strengths and gaps.
      </p>
      <ResumeDropzone onFileSelect={onFileSelect} disabled={disabled} />
      <p className="text-[11px] text-neutral-400">
        Your resume is analyzed in real-time and not stored on our servers.
      </p>
    </div>
  )
}
