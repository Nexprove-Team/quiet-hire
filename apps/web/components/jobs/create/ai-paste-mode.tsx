'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'

import { useCreateJob } from '@/hooks/use-jobs'

import { Button } from '@hackhyre/ui/components/button'
import { Textarea } from '@hackhyre/ui/components/textarea'
import { Spinner } from '@hackhyre/ui/components/spinner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { MagicStar, LinkIcon, DocumentText } from '@hackhyre/ui/icons'

import { AiParseResult } from './ai-parse-result'
import { MOCK_AI_PARSED_JOB } from '@/lib/mock-data'

type ParsedJob = typeof MOCK_AI_PARSED_JOB

export function AIPasteMode() {
  const router = useRouter()
  const { mutateAsync, isPending: isCreating } = useCreateJob()
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedJob | null>(null)

  async function handleCreateFromParsed(data: ParsedJob, asDraft: boolean) {
    try {
      await mutateAsync({
        title: data.title,
        description: data.description,
        employmentType: data.employmentType,
        experienceLevel: data.experienceLevel,
        location: data.location,
        isRemote: data.isRemote,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        skills: data.skills,
        status: asDraft ? 'draft' : 'open',
      })
      toast.success(asDraft ? 'Draft saved!' : 'Job published!', {
        description: `"${data.title}" has been ${asDraft ? 'saved as a draft' : 'published'}.`,
      })
      router.push('/recuriter/jobs')
    } catch (error) {
      toast.error('Failed to create job', {
        description: error instanceof Error ? error.message : 'Something went wrong',
      })
    }
  }

  async function handleAnalyze() {
    if (!input.trim()) {
      toast.error('Please paste a job description or URL first')
      return
    }

    setIsAnalyzing(true)

    // Mock AI analysis
    await new Promise((r) => setTimeout(r, 2500))

    setParsedData(MOCK_AI_PARSED_JOB)
    setIsAnalyzing(false)
    toast.success('Analysis complete!', {
      description: "We've extracted the job details. Review and edit below.",
    })
  }

  function handleBack() {
    setParsedData(null)
  }

  return (
    <AnimatePresence mode="wait">
      {parsedData ? (
        <AiParseResult
          key="result"
          data={parsedData}
          onBack={handleBack}
          onCreateJob={handleCreateFromParsed}
          isCreating={isCreating}
        />
      ) : (
        <motion.div
          key="input"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <MagicStar size={20} variant="Bulk" className="text-primary" />
                AI Job Parser
              </CardTitle>
              <CardDescription>
                Paste a full job description or a link to one — our AI will
                extract and structure all the details for you.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="bg-muted flex h-8 items-center gap-1.5 rounded-md px-3">
                  <DocumentText
                    size={14}
                    variant="Bulk"
                    className="text-muted-foreground"
                  />
                  <span className="text-muted-foreground text-xs font-medium">
                    Text
                  </span>
                </div>
                <div className="bg-muted flex h-8 items-center gap-1.5 rounded-md px-3">
                  <LinkIcon
                    size={14}
                    variant="Bulk"
                    className="text-muted-foreground"
                  />
                  <span className="text-muted-foreground text-xs font-medium">
                    URL
                  </span>
                </div>
              </div>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste the job description here, or enter a URL to a job posting...&#10;&#10;Example:&#10;We are looking for a Senior Frontend Engineer to join our team. The ideal candidate has 5+ years of experience with React, TypeScript, and modern web technologies..."
                rows={12}
                className="resize-none"
              />
            </CardContent>

            <CardFooter className="justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setInput('')}
                disabled={!input || isAnalyzing}
              >
                Clear
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={!input.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <MagicStar size={16} variant="Bold" className="mr-1.5" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
