'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft } from '@hackhyre/ui/icons'
import { Loader2 } from 'lucide-react'
import { Button } from '@hackhyre/ui/components/button'
import { toast } from 'sonner'
import { ResumeDropzone } from './resume-dropzone'
import { ResumeReviewForm } from './resume-review-form'

type Phase = 'upload' | 'parsing' | 'review'

interface ResumeUploadModeProps {
  onBack: () => void
}

interface ParsedData {
  headline?: string
  bio?: string
  skills?: string[]
  experienceYears?: number
  location?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
}

export function ResumeUploadMode({ onBack }: ResumeUploadModeProps) {
  const [phase, setPhase] = useState<Phase>('upload')
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)

  async function handleFileSelect(file: File) {
    setPhase('parsing')

    try {
      // Upload
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/onboarding/api/resume/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const { error } = await uploadRes.json()
        throw new Error(error || 'Upload failed')
      }

      const { url } = await uploadRes.json()
      setResumeUrl(url)

      // Parse
      const parseRes = await fetch('/onboarding/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!parseRes.ok) {
        const { error } = await parseRes.json()
        throw new Error(error || 'Parse failed')
      }

      const parsed = await parseRes.json()
      setParsedData(parsed)
      setPhase('review')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
      setPhase('upload')
    }
  }

  if (phase === 'review' && parsedData && resumeUrl) {
    return (
      <ResumeReviewForm
        parsed={parsedData}
        resumeUrl={resumeUrl}
        onBack={() => setPhase('upload')}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col justify-center space-y-6 p-6 lg:p-10"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
        >
          <ArrowLeft size={18} variant="Linear" />
        </button>
        <div className="space-y-0.5">
          <h2 className="font-mono text-lg font-bold tracking-tight">
            Upload Resume
          </h2>
          <p className="text-muted-foreground text-xs">
            We&apos;ll extract your profile info automatically
          </p>
        </div>
      </div>

      {phase === 'upload' && <ResumeDropzone onFileSelect={handleFileSelect} />}

      {phase === 'parsing' && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium">Analyzing your resume...</p>
            <p className="text-muted-foreground text-xs">
              This usually takes a few seconds
            </p>
          </div>
        </div>
      )}

      {phase === 'upload' && (
        <Button variant="outline" onClick={onBack} className="w-full">
          Choose a different method
        </Button>
      )}
    </motion.div>
  )
}
