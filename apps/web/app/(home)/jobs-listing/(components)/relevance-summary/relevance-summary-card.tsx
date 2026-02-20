'use client'

import { motion } from 'motion/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { MagicStar } from '@hackhyre/ui/icons'
import { useRelevance } from './use-relevance'
import { RelevanceSummaryCTA } from './relevance-summary-cta'
import { RelevanceSummaryResult } from './relevance-summary-result'
import type { JobDataForRelevance } from './types'

interface RelevanceSummaryCardProps {
  jobData: JobDataForRelevance
}

export function RelevanceSummaryCard({ jobData }: RelevanceSummaryCardProps) {
  const {
    status,
    summary,
    error,
    handleFileUpload,
    handleChangeResume,
  } = useRelevance(jobData)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04, duration: 0.3 }}
    >
      <Card className="border-neutral-200 bg-white shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-900">
            <MagicStar size={16} variant="Bold" className="text-primary" />
            Relevance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'idle' && (
            <RelevanceSummaryCTA
              onFileSelect={handleFileUpload}
              disabled={false}
            />
          )}

          {status === 'parsing' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
              <p className="text-[13px] text-neutral-500">
                Parsing your resume...
              </p>
            </div>
          )}

          {status === 'generating' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
              <p className="text-[13px] text-neutral-500">
                Analyzing relevance...
              </p>
            </div>
          )}

          {status === 'ready' && summary && (
            <RelevanceSummaryResult
              summary={summary}
              onChangeResume={handleChangeResume}
            />
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <p className="text-[13px] text-rose-600">
                {error ?? 'Something went wrong. Please try again.'}
              </p>
              <RelevanceSummaryCTA
                onFileSelect={handleFileUpload}
                disabled={false}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
